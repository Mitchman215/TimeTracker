package edu.brown.cs.student.commands;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
import com.google.common.collect.Sets;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import edu.brown.cs.student.repl.Command;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.Select;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * Script to scrape CAB to get all valid subjects / departments, updating the 'departments'
 * collection in firestore with the information.
 * Note: codes like "CSCI" apparently refer to the subject, not department. So we probably want to
 * rename all occurences of "department" with "subject" in this app eventually.
 */
public class AddDepartments implements Command {
  
  private static final String COMMAND_NAME = "add-departments";
  
  private static final String CAB_URL = "https://cab.brown.edu/";
  
  private static final String PATH_TO_KEY = "secret/time-tracker-669e3-8ec92c95370d.json";

  private static final String DEPT_META_DOC_PATH = "departments/_meta";
  
  private final Firestore db;
  
  public AddDepartments() throws IOException {
    WebDriverManager.chromedriver().setup();
    InputStream serviceAccount = new FileInputStream(PATH_TO_KEY);
    GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
    FirebaseOptions options = FirebaseOptions.builder()
          .setCredentials(credentials)
          .build();
    FirebaseApp.initializeApp(options);

    this.db = FirestoreClient.getFirestore();
  }
  
  @Override
  public String execute(String[] args) {
    // this command has no arguments
    if (args.length != 0) {
      throw new IllegalArgumentException();
    }
    
    ChromeOptions options = new ChromeOptions();
    // disables browser from opening
    options.setHeadless(true);

    ChromeDriver driver = new ChromeDriver(options);
    // if you can't find something, wait a bit (handles if page hasn't loaded yet)
    driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));
    driver.get(CAB_URL);

    // get subjects from CAB through the subject filter dropdown
    Select subjectsDropdown = new Select(driver.findElement(By.id("crit-subject")));
    List<WebElement> allSubjectOptions = subjectsDropdown.getOptions();
    List<String> allSubjects = allSubjectOptions.stream()
        .map(elt -> elt.getText())
        .collect(Collectors.toList());

    Set<String> newCodes = new HashSet<>();
    Set<String> oldCodes = new HashSet<>();
    try {
      // get all subjects already in firestore
      Set<String> subjectCodesInDb = db.collection("departments").get()
            .get().getDocuments().stream()
            .map(doc -> doc.getId())
            .collect(Collectors.toSet());


      // save new subjects to firestore
      allSubjects
          .forEach((subj) -> {
            String[] split = subj.split("\\(");
            // handle the first option that is "Any subject"
            if (split.length == 1) {
              return;
            }
            String name = split[0];
            String code = split[1].substring(0, split[1].length() - 1);
            // System.out.println(name + ": " + code);
            // make sure subject is not already in firestore
            if (!subjectCodesInDb.contains(code)) {
              newCodes.add(code);
              Map<String, String> docData = Map.of(
                    "name", name,
                    "daily_average", "0",
                    "total_time", "0",
                    "weekly_average", "0"
              );
              // send new doc to firestore
              db.collection("departments").document(code).set(docData, SetOptions.merge());
            } else {
              oldCodes.add(code);
            }
          });

      // update the metadata document
      List<String> allCodes = List.copyOf(Sets.union(newCodes, oldCodes));
      db.document(DEPT_META_DOC_PATH).set(Map.of("all_codes", allCodes), SetOptions.merge());
    } catch (ExecutionException | InterruptedException e) {
      e.printStackTrace();
      return "ERROR: " + e;
    }

    driver.quit();
    return "Added " + newCodes.size() + " subjects: " + newCodes + ".\n"
          + oldCodes.size() + " subjects were already in the db: " + oldCodes;
  }

  @Override
  public String getName() {
    return COMMAND_NAME;
  }

  @Override
  public String getUsage() {
    return COMMAND_NAME;
  }
}
