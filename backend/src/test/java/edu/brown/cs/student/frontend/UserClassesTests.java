package edu.brown.cs.student.frontend;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.Color;
import org.openqa.selenium.Alert;

import java.util.List;

import org.junit.Test;

public class UserClassesTests {
    private ChromeDriver driver;
    
    @Before
    public void initialize() throws InterruptedException {
      // Providing the path to a chromedriver
      String chromePath = "/Users/siddharthboppana/Desktop/CSCI0320/chromedriver";
  
      // Setting properties
      System.setProperty("webdriver.chrome.driver", chromePath);
      System.setProperty("webdriver.chrome.silentOutput", "true");

      // Defining chromedriver and loading html file
      ChromeOptions options = new ChromeOptions();
      options.addArguments("--user-data-dir=/Users/siddharthboppana/Library/Application Support/Google/Chrome", "--profile-directory=Profile 3");
      this.driver = new ChromeDriver(options);
    }

  @Test
  public void searchClassTest() throws InterruptedException {
      driver.get("http://localhost:3000");
      // providing time to render
      Thread.sleep(2000);

      try {
        // get a list of all of the user's classes
        List<WebElement> liTagsBefore = driver.findElements(By.tagName("li"));

        // enter MCM 0230 into the search bar and check that a suggestion appears
        WebElement inputExistingClass = driver.findElement(By.id("existing-class"));
        inputExistingClass.sendKeys("MCM 0230");
        Thread.sleep(2000);
        Boolean isSuggestionPresent = driver.findElements(By.id("MCM 0230 suggestion")).size() > 0;
        assertTrue(isSuggestionPresent);

        // click the suggestion button
        WebElement MCM0230SuggestionButton = driver.findElement(By.id("MCM 0230 suggestion"));
        MCM0230SuggestionButton.click();

        Thread.sleep(2000);

        // check if MCM 0230 has been added as a current class
        Boolean isAddedClassPresent = driver.findElements(By.id("MCM 0230 class")).size() > 0;
        assertTrue(isAddedClassPresent);

        // check if the number of classes is different than before the button was clicked
        List<WebElement> liTagsAdded = driver.findElements(By.tagName("li"));
        Boolean oneMoreList = !liTagsAdded.equals(liTagsBefore);
        assertTrue(oneMoreList);

        // check if after adding the class that it disappears from the suggestions
        Thread.sleep(2000);
        isSuggestionPresent = driver.findElements(By.id("MCM 0230 suggestion")).size() > 0;
        assertTrue(!isSuggestionPresent);

        // click the delete button for MCM 0230
        WebElement MCM0230ClassButton = driver.findElement(By.id("MCM 0230 class"));
        MCM0230ClassButton.click();

        Thread.sleep(2000);

        // accept to confirm deleting the class
        Alert alert = driver.switchTo().alert();
        alert.accept();

        Thread.sleep(2000);

        // check if the classes before and after are the same after adding and deleting
        List<WebElement> liTagsAfter = driver.findElements(By.tagName("li"));
        Boolean sameList = liTagsBefore.equals(liTagsAfter);
        assertTrue(sameList);

      } catch (Exception e) {
        fail();
      }
  }

  @Test
  public void newClassExistsTest() throws InterruptedException {
    driver.get("http://localhost:3000");
      // providing time to render
      Thread.sleep(2000);

      try {
        // add the corresponding information for CSCI 0190 into the input fields for a new class
        WebElement departmentInputField = driver.findElement(By.id("department-input"));
        departmentInputField.sendKeys("CSCI");

        WebElement numberInputField = driver.findElement(By.id("number-input"));
        numberInputField.sendKeys("0190");

        WebElement classInputField = driver.findElement(By.id("class-input"));
        classInputField.sendKeys("Accelerated Introduction To Computer Science");

        WebElement newClassButton = driver.findElement(By.id("submit-new-class"));
        newClassButton.click();

        Thread.sleep(2000);

        // check if an error message pops up after searching for an existing class
        Boolean errorMessagePresent = driver.findElements(By.id("error-adding-class")).size() > 0;
        assertTrue(errorMessagePresent);

      } catch (Exception e) {
        fail();
      }
  }

  @After
  public void quitDriver() {
    driver.quit();
  }
}
