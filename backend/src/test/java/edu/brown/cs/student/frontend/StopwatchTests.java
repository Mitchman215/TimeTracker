package edu.brown.cs.student.frontend;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.Color;

public class StopwatchTests {
    private ChromeDriver driver;
    
    @Before
    public void initialize() throws InterruptedException {
      // Providing the path to a chromedriver
      String chromePath = "/Program Files (x86)/chromedriver.exe";
  
      // Setting properties
      System.setProperty("webdriver.chrome.driver", chromePath);
      System.setProperty("webdriver.chrome.silentOutput", "true");
  
      // Defining chromedriver and loading html file
      ChromeOptions options = new ChromeOptions();
      options.addArguments("user-data-dir=C:/Users/desim/AppData/Local/Google/Chrome/User Data", "--profile-directory=Profile 1");
      this.driver = new ChromeDriver(options); 
    }

    //test stopwatch counting functionality
    @Test
    public void stopwatchTest() throws InterruptedException {
      driver.get("http://localhost:3000/timetracker");
      // providing time to render
      Thread.sleep(2000);

      try {
        //start button
        WebElement startButton = driver.findElement(By.id("start-button"));
        //press start button
        startButton.click();
        //wait two seconds
        Thread.sleep(2000);
        //pause button
        WebElement pauseButton = driver.findElement(By.id("pause-button"));
        //press pause button
        pauseButton.click();
        //time display
        WebElement timeDiv = driver.findElement(By.id("time"));
        //time display text
        String timeVal = timeDiv.getText();

        assertEquals(timeVal, "00:00:02");

        

        
      } catch (Exception e) {
          fail();
      }
    }

    //test text displays
    @Test
    public void stopwatchTest2() throws InterruptedException {
      driver.get("http://localhost:3000/timetracker");
      // providing time to render
      Thread.sleep(2000);

      try {
        //start button
        WebElement startButton = driver.findElement(By.id("start-button"));
        String startText = startButton.getText();
        assertEquals(startText, "Start");
        //press start button
        startButton.click();
        
        //pause button
        WebElement pauseButton = driver.findElement(By.id("pause-button"));
        String pauseText = pauseButton.getText();
        assertEquals(pauseText, "Pause");
        //press pause button
        pauseButton.click();

        //resume button
        WebElement resumeButton = driver.findElement(By.id("resume-button"));
        String resumeText = resumeButton.getText();
        assertEquals(resumeText, "Resume");
        //press pause button
        resumeButton.click();


        //goes back to pause after resume pressed
        WebElement newPauseButton = driver.findElement(By.id("pause-button"));
        String newPauseText = newPauseButton.getText();
        assertEquals(newPauseText, "Pause");

        //log button
        WebElement logButton = driver.findElement(By.id("log-button"));
        String logText = logButton.getText();
        assertEquals(logText, "Log Study Time");

        //reset button
        WebElement resetButton = driver.findElement(By.id("reset-button"));
        String resetText = resetButton.getText();
        assertEquals(resetText, "Reset");


      } catch (Exception e) {
          fail();
      }
    }

    //test log record, resume, and reset functionality
    @Test
    public void stopwatchTest3() throws InterruptedException {
      driver.get("http://localhost:3000/timetracker");
      // providing time to render
      Thread.sleep(2000);

      try {
        //start button
        WebElement startButton = driver.findElement(By.id("start-button"));
        
        //press start button
        startButton.click();

        //wait 5 seconds
        Thread.sleep(5000);
        
        //pause button
        WebElement pauseButton = driver.findElement(By.id("pause-button"));
        
        //press pause button
        pauseButton.click();

        //time display
        WebElement timeDiv = driver.findElement(By.id("time"));
        //time display text
        String timeVal = timeDiv.getText();

        assertEquals(timeVal, "00:00:05");

        //resume button
        WebElement resumeButton = driver.findElement(By.id("resume-button"));
        
        //press resume button
        resumeButton.click();

        //wait 5 seconds
        Thread.sleep(5000);

        String timeVal2 = timeDiv.getText();
        assertEquals(timeVal2, "00:00:10");

        //reset button
        WebElement resetButton = driver.findElement(By.id("reset-button"));
        
        //press reset
        resetButton.click();
        String timeVal3 = timeDiv.getText();
        assertEquals(timeVal3, "00:00:00");

        startButton.click();
        Thread.sleep(2000);
        pauseButton.click();
        WebElement logButton = driver.findElement(By.id("log-button"));
        logButton.click();
        String timeVal4 = timeDiv.getText();
        assertEquals(timeVal4, "00:00:00");

      } catch (Exception e) {
          fail();
      }
    }

    

    

    @After
    public void quitDriver() {
      driver.quit();
    }
}
