package edu.brown.cs.student.frontend;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class PomTimerTests {

  private static final String pathToProfileData =
        "/Users/mitchell/Library/Application Support/Google/Chrome";

  private static final String urlToApp = "http://localhost:3000/timetracker";

  private ChromeDriver driver;

  @Before
  public void initialize() {
    // Setting up the Chrome web driver
    WebDriverManager.chromedriver().setup();

    // Defining chromedriver and loading html file
    ChromeOptions options = new ChromeOptions();
    // options.addArguments("user-data-dir=C:/Users/desim/AppData/Local/Google/Chrome/User Data", "--profile-directory=Profile 1");
    options.addArguments("user-data-dir=" + pathToProfileData, "--profile-directory=Profile 3");
    this.driver = new ChromeDriver(options);
  }

  @Test
  public void test() throws InterruptedException {
    driver.get(urlToApp);
    // providing time to render
    Thread.sleep(1000);

    // switch to Pomodoro timer
    // WebElement modeDropdown = driver.findElement(By.)
    assertTrue(true);
  }
}
