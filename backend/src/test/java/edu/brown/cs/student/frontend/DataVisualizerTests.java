package edu.brown.cs.student.frontend;

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

public class DataVisualizerTests {
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
      options.addArguments("user-data-dir=C:/Users/nicky/AppData/Local/Google/Chrome/User Data/");
      this.driver = new ChromeDriver(options); 
    }

    @Test
    public void recordsTest() throws InterruptedException {
      driver.get("http://localhost:3000/records");
      // providing time to render
      Thread.sleep(2000);

      try {
        // y-axis
        WebElement yAxis = driver.findElement(By.id("y-axis-records"));
        assertTrue(yAxis.getText().equals("Duration(s)"));

        // graph laebl
        WebElement recLabel = driver.findElement(By.id("records-label"));
        assertTrue(recLabel.getText().contains(" Time By Class"));

        // title
        WebElement titleRec = driver.findElement(By.id("title-records"));
        assertTrue(titleRec.getText().equals("Record Comparison Visualizer"));

        // modal labels
        WebElement className = driver.findElement(By.id("class-name-records"));
        assertTrue(className.getText().contains("Class Name:"));
        WebElement startStamp = driver.findElement(By.id("start-stamp-records"));
        assertTrue(startStamp.getText().contains("Start Stamp:"));
        WebElement finishStamp = driver.findElement(By.id("finish-stamp-records"));
        assertTrue(finishStamp.getText().contains("Finish Stamp:"));
        WebElement duration = driver.findElement(By.id("duration-records"));
        assertTrue(duration.getText().contains("Duration:"));

        // left box
        WebElement leftBox = driver.findElement(By.id("left-box-records"));
        assertTrue(Color.fromString(leftBox.getCssValue("background-color")).asHex().equals("#ffffff"));

        // right box
        WebElement rightBox = driver.findElement(By.id("right-box-records"));
        assertTrue(Color.fromString(rightBox.getCssValue("background-color")).asHex().equals("#ffffff"));

        // background
        WebElement bg = driver.findElement(By.id("background-records"));
        assertTrue(Color.fromString(bg.getCssValue("background-color")).asHex().equals("#000000"));
      } catch (Exception  e) {
        fail();
      }
    }

    @Test
    public void departmentTest() throws InterruptedException {
      driver.get("http://localhost:3000/departments");
      // providing time to render
      Thread.sleep(2000);

      try {
        // y-axis
        WebElement yAxis = driver.findElement(By.id("y-axis-dpt-class"));
        assertTrue(yAxis.getText().equals("Duration(hr)"));

        // graph laebl
        WebElement recLabel = driver.findElement(By.id("dpt-class-label"));
        assertTrue(recLabel.getText().contains("Time By "));

        // title
        WebElement titleRec = driver.findElement(By.id("title-dpt"));
        assertTrue(titleRec.getText().contains("Department Comparison Visualizer"));

        // modal labels
        WebElement daily = driver.findElement(By.id("daily-avg-dpt-class"));
        assertTrue(daily.getText().contains("Daily Average:"));
        WebElement wkly = driver.findElement(By.id("wkly-avg-dpt-class"));
        assertTrue(wkly.getText().contains("Weekly Average:"));
        WebElement total = driver.findElement(By.id("total-dpt-class"));
        assertTrue(total.getText().contains("Total Time:"));
        WebElement name = driver.findElement(By.id("name-dpt-class"));
        assertTrue(name.getText().contains("Name:"));

        // left box
        WebElement leftBox = driver.findElement(By.id("left-box-dpt-class"));
        assertTrue(Color.fromString(leftBox.getCssValue("background-color")).asHex().equals("#ffffff"));

        // open modal for modal testing
        WebElement modalButton = driver.findElement(By.id("dpt-class-modal"));
        modalButton.click();
        Thread.sleep(2000);

        // modal label
        WebElement modalLabel = driver.findElement(By.id("modal-tital-dpt-class"));
        assertTrue(modalLabel.getText().equals("Select Department to Compare"));


        // right box
        WebElement rightBox = driver.findElement(By.id("right-box-dpt-class"));
        assertTrue(Color.fromString(rightBox.getCssValue("background-color")).asHex().equals("#ffffff"));

        // background
        WebElement bg = driver.findElement(By.id("dpt-bg"));
        assertTrue(Color.fromString(bg.getCssValue("background-color")).asHex().equals("#000000"));

      } catch (Exception  e) {
        fail();
      }
    }

    @Test
    public void classTest() throws InterruptedException {
      driver.get("http://localhost:3000/classes");
      // providing time to render
      Thread.sleep(2000);

      try {
        // y-axis
        WebElement yAxis = driver.findElement(By.id("y-axis-dpt-class"));
        assertTrue(yAxis.getText().equals("Duration(hr)"));

        // graph laebl
        WebElement recLabel = driver.findElement(By.id("dpt-class-label"));
        assertTrue(recLabel.getText().contains("Time By "));

        // title
        WebElement titleRec = driver.findElement(By.id("title-class"));
        assertTrue(titleRec.getText().equals("Class Comparison Visualizer"));

        // modal labels
        WebElement daily = driver.findElement(By.id("daily-avg-dpt-class"));
        assertTrue(daily.getText().contains("Daily Average:"));
        WebElement wkly = driver.findElement(By.id("wkly-avg-dpt-class"));
        assertTrue(wkly.getText().contains("Weekly Average:"));
        WebElement total = driver.findElement(By.id("total-dpt-class"));
        assertTrue(total.getText().contains("Total Time:"));
        WebElement name = driver.findElement(By.id("name-dpt-class"));
        assertTrue(name.getText().contains("Name:"));

        // left box
        WebElement leftBox = driver.findElement(By.id("left-box-dpt-class"));
        assertTrue(Color.fromString(leftBox.getCssValue("background-color")).asHex().equals("#ffffff"));

        // open modal
        WebElement modalButton = driver.findElement(By.id("dpt-class-modal"));
        modalButton.click();
        Thread.sleep(2000);

        // modal left box
        WebElement modalBox = driver.findElement(By.id("modal-tital-dpt-class"));
        assertTrue(modalBox.getText().equals("Select Class to Compare"));

        // right box
        WebElement rightBox = driver.findElement(By.id("right-box-dpt-class"));
        assertTrue(Color.fromString(rightBox.getCssValue("background-color")).asHex().equals("#ffffff"));

        // background
        WebElement bg = driver.findElement(By.id("class-bg"));
        assertTrue(Color.fromString(bg.getCssValue("background-color")).asHex().equals("#000000"));

      } catch (Exception  e) {
        fail();
      }
    }

    @Test
    public void userTest() throws InterruptedException {
      driver.get("http://localhost:3000/user");
      // providing time to render
      Thread.sleep(2000);

      try {
        // hovering modal and timebar test
        // day button
        WebElement dayButton = driver.findElement(By.id("day-button"));
        dayButton.click();
        Thread.sleep(1000);

        // verifying modal has correct elts
        driver.findElement(By.id("Class:"));
        driver.findElement(By.id("Average:"));
        driver.findElement(By.id("Day:"));

        // week button
        WebElement weekButton = driver.findElement(By.id("week-button"));
        weekButton.click();
        Thread.sleep(1000);

        // verifying modal has correct elts
        driver.findElement(By.id("Class:"));
        driver.findElement(By.id("Average:"));
        driver.findElement(By.id("Start:"));
        driver.findElement(By.id("Finish:"));

        // month button
        WebElement monthButton = driver.findElement(By.id("month-button"));
        monthButton.click();
        Thread.sleep(1000);

        // verifying modal has correct elts
        driver.findElement(By.id("Class:"));
        driver.findElement(By.id("Average:"));
        driver.findElement(By.id("Month:"));

        // clear button
        WebElement clearButton = driver.findElement(By.id("clear-button"));
        clearButton.click();
        Thread.sleep(1000);

        // verifying empty modal
        try {
          driver.findElement(By.id("Class:"));
          fail();
        } catch (Exception e) {
          assertTrue(true);
        }

        // add class button
        WebElement dropdown = driver.findElement(By.id("add-class-button"));
        assertTrue(dropdown.getText().equals("Add Classes"));
        dropdown.click();

        // close class button
        WebElement close = driver.findElement(By.id("close-button"));
        assertTrue(close.getText().equals("Close"));
        close.click();

        // y-axis
        WebElement yAxis = driver.findElement(By.id("user-y-axis"));
        assertTrue(yAxis.getText().equals("Duration(s)"));

        // title
        WebElement titleRec = driver.findElement(By.id("user-title"));
        assertTrue(titleRec.getText().equals("Compare Time on Classes Visualizer"));

        // left box
        WebElement leftBox = driver.findElement(By.id("user-left-box"));
        assertTrue(Color.fromString(leftBox.getCssValue("background-color")).asHex().equals("#ffffff"));

        // right box
        WebElement rightBox = driver.findElement(By.id("user-right-box"));
        assertTrue(Color.fromString(rightBox.getCssValue("background-color")).asHex().equals("#ffffff"));

        // background
        WebElement bg = driver.findElement(By.id("user-bg"));
        assertTrue(Color.fromString(bg.getCssValue("background-color")).asHex().equals("#000000"));

      } catch (Exception  e) {
        fail();
      }
    }

    @After
    public void quitDriver() {
      driver.quit();
    }
}
