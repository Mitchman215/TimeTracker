package edu.brown.cs.student.frontend;

import static org.junit.Assert.assertTrue;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class DataVisualizer {
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
      this.driver = new ChromeDriver(options); 
      driver.get("http://localhost:3000/records");

      Thread.sleep(20000);
    }

    @Test
    public void basicTest() {
        assertTrue(true);
    }

    @After
    public void quitDriver() {
      driver.quit();
    }
}
