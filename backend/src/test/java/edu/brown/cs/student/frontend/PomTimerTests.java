package edu.brown.cs.student.frontend;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.Select;

public class PomTimerTests {

  private static final String pathToProfileData =
        "/Users/mitchell/Library/Application Support/Google/Chrome";

  private static final String urlToApp = "http://localhost:3000/timetracker";

  private ChromeDriver driver;

  @Before
  public void initialize() throws InterruptedException {
    // Setting up the Chrome web driver
    WebDriverManager.chromedriver().setup();

    // Defining chromedriver and loading html file
    ChromeOptions options = new ChromeOptions();
    options.addArguments("user-data-dir=" + pathToProfileData, "--profile-directory=Profile 3");
    this.driver = new ChromeDriver(options);

    driver.get(urlToApp);
    // providing time to render page
    Thread.sleep(1000);

    // switch to Pomodoro timer
    Select modeDropdown = new Select(driver.findElement(By.id("mode-selector")));
    modeDropdown.selectByVisibleText("Pomodoro Timer");
    Thread.sleep(1000);
  }

  @Test
  public void defaultPomSettings() throws InterruptedException {
    // clear settings to get default values
    clearSettings();
    driver.findElement(By.id("save-settings-button")).click();

    // check settings are default values
    driver.findElement(By.id("open-settings-button")).click();
    assertEquals("25", driver.findElement(By.id("work-input")).getAttribute("value"));
    assertEquals("5", driver.findElement(By.id("sBreak-input")).getAttribute("value"));
    assertEquals("15", driver.findElement(By.id("lBreak-input")).getAttribute("value"));
    assertEquals("4", driver.findElement(By.id("numPoms-input")).getAttribute("value"));
    driver.findElement(By.id("close-settings-button")).click();

    // make sure default work time is 25:00
    checkTimerDisplay("00:25:00");
    assertEquals("Click the start button to begin",
          driver.findElement(By.id("stage-message")).getText());
    assertEquals("#Poms: 0", driver.findElement(By.id("pom-count")).getText());

    // start timer
    driver.findElement(By.id("start-button")).click();
    assertTrue(driver.findElement(By.id("stage-message"))
          .getText()
          .startsWith("Time to grind. Working on "));
    assertEquals("#Poms: 0", driver.findElement(By.id("pom-count")).getText());

    // After 2 seconds, check time has gone down to 24:58
    Thread.sleep(2000);
    checkTimerDisplay("00:24:58");

    // pause timer
    driver.findElement(By.id("pause-button")).click();
    // check that timer is actually paused and doesn't change after 2 seconds
    Thread.sleep(2000);
    checkTimerDisplay("00:24:58");

    // resume timer and check that timer continues to count down
    driver.findElement(By.id("resume-button")).click();
    Thread.sleep(1000);
    checkTimerDisplay("00:24:57");

    // finish timer early, make sure ui updates accordingly
    driver.findElement(By.id("finish-button")).click();
    assertEquals("Nice! Take a short break",
          driver.findElement(By.id("stage-message")).getText());
    assertEquals("#Poms: 1", driver.findElement(By.id("pom-count")).getText());
    checkTimerDisplay("00:05:00");

    // After 1 second, check time has gone down to 4:59
    // note: timer doesn't start immediately here, takes about a second to start
    Thread.sleep(2200);
    checkTimerDisplay("00:04:59");

    // clicking stop should open an alert prompting user to continue
    driver.findElement(By.id("stop-button")).click();
    Alert alert = driver.switchTo().alert();
    assertEquals("Stopping the Pomodoro Timer will lose all unfinished study progress.",
          alert.getText());

    // cancel the stopping action, check that timer was paused but now unpauses
    Thread.sleep(1000);
    driver.switchTo().alert().dismiss();
    checkTimerDisplay("00:04:59");
    Thread.sleep(1000);
    checkTimerDisplay("00:04:58");

    // now actually go through with stopping the timer
    driver.findElement(By.id("stop-button")).click();
    alert = driver.switchTo().alert();
    alert.accept();
    // timer ui should now be back to the initial state
    checkTimerDisplay("00:25:00");
    assertEquals("Click the start button to begin",
          driver.findElement(By.id("stage-message")).getText());
    assertEquals("#Poms: 0", driver.findElement(By.id("pom-count")).getText());
  }

  @Test
  public void shortPomSettings() throws InterruptedException {
    clearSettings();
    // set each time setting to 3 seconds
    driver.findElement(By.id("work-input")).sendKeys("0.05");
    driver.findElement(By.id("sBreak-input")).sendKeys("0.05");
    driver.findElement(By.id("lBreak-input")).sendKeys("0.05");
    driver.findElement(By.id("numPoms-input")).sendKeys("2");
    driver.findElement(By.id("close-settings-button")).click();

    // make sure timer ui is at initial state
    checkTimerDisplay("00:00:03");
    assertEquals("Click the start button to begin",
          driver.findElement(By.id("stage-message")).getText());
    assertEquals("#Poms: 0", driver.findElement(By.id("pom-count")).getText());

    // start timer
    driver.findElement(By.id("start-button")).click();
    assertTrue(driver.findElement(By.id("stage-message"))
          .getText()
          .startsWith("Time to grind. Working on "));
    assertEquals("#Poms: 0", driver.findElement(By.id("pom-count")).getText());

    // After 2 seconds, check time has gone down to 00:01
    Thread.sleep(2000);
    checkTimerDisplay("00:00:01");

    // timer should transition to next stage after it is finished
    Thread.sleep(1000);
    checkTimerDisplay("00:00:03");
    assertEquals("Nice! Take a short break",
          driver.findElement(By.id("stage-message")).getText());
    assertEquals("#Poms: 1", driver.findElement(By.id("pom-count")).getText());

    // after 3 seconds, timer should go back to work stage
    Thread.sleep(3000);
    checkTimerDisplay("00:00:03");
    assertTrue(driver.findElement(By.id("stage-message"))
          .getText()
          .startsWith("Time to grind. Working on "));
    assertEquals("#Poms: 1", driver.findElement(By.id("pom-count")).getText());

    // after this work stage finishes, should go to long break
    Thread.sleep(3000);
    checkTimerDisplay("00:00:03");
    assertEquals("Good job! Take a long break, you deserve it",
          driver.findElement(By.id("stage-message")).getText());
    assertEquals("#Poms: 2", driver.findElement(By.id("pom-count")).getText());

    // after long break finishes, should go back to initial state before starting
    Thread.sleep(3000);
    checkTimerDisplay("00:00:03");
    assertEquals("Click the start button to begin",
          driver.findElement(By.id("stage-message")).getText());
    assertEquals("#Poms: 0", driver.findElement(By.id("pom-count")).getText());
  }

  private void clearSettings() {
    // clearing settings and submitting should set them to their default values
    driver.findElement(By.id("open-settings-button")).click();

    WebElement workInput = driver.findElement(By.id("work-input"));
    WebElement sBreakInput = driver.findElement(By.id("sBreak-input"));
    WebElement lBreakInput = driver.findElement(By.id("lBreak-input"));
    WebElement numPomsInput = driver.findElement(By.id("numPoms-input"));

    workInput.clear();

    sBreakInput.clear();

    lBreakInput.clear();

    numPomsInput.clear();
  }

  private void checkTimerDisplay(String expected) {
    assertEquals(expected, driver.findElement(By.id("time")).getText());
  }

}
