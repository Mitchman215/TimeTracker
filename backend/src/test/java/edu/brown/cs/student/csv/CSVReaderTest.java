package edu.brown.cs.student.csv;

import edu.brown.cs.student.csv.exceptions.CSVFileFormatException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;
import java.util.zip.DataFormatException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThrows;

// Note: this class also tests CSVDefaultParser implicitly
public class CSVReaderTest {

  static final List<String> EXPECTED_STANTON_LIST = List.of(
      "1", "Stanton Swalough", "sswalough0@ask.com", "Female", "junior", "375-75-3870",
      "Russia", "American Indian or Alaska Native", "18", "email", "2", "in person", "morning",
      "2", "quick learner, prepared, team player, early starter, friendly",
      "cutthroat, unfriendly, late", "OOP", "mathematics, film/photography, politics");

  static final List<String> EXPECTED_MARIKA_LIST = List.of(
      "2", "Marika Reedie", "mreedie1@cam.ac.uk", "Female", "senior", "718-88-2492",
      "Tunisia", "and Native Hawaiian or Other Pacific Islander", "10", "slack", "16",
      "in person", "night", "32", "good leader, honest, quick learner, early starter",
      "unresponsive, dishonest, late", "data structures", "politics, theatre, music");

  static final List<String> EXPECTED_CATE_LIST = List.of(
      "3", "Cate Geldert", "cgeldert2@rakuten.co.jp", "Male", "freshman", "577-69-3607",
      "Portugal", "Black or African American", "13", "zoom", "2", "virtual", "night", "66",
      "honest, good teacher, friendly, prepared", "cutthroat, unprepared, dishonest, late",
      "OOP", "theatre, business");

  CSVReader<List<String>> reader;

  @Before
  public void setup() throws FileNotFoundException {
    reader = new CSVReader<>(new FileReader("data/project1/small_headerless.csv"),
        new CSVDefaultParser());
  }

  @After
  public void takeDown() throws IOException {
    reader.close();
    reader = null;
  }

  @Test
  public void readNext() throws IOException, DataFormatException {
    // first line
    assertEquals(EXPECTED_STANTON_LIST, reader.readNext());

    // second line
    assertEquals(EXPECTED_MARIKA_LIST, reader.readNext());
  }

  @Test
  public void readAll() throws IOException, DataFormatException {
    List<List<String>> expected = List.of(
        EXPECTED_STANTON_LIST, EXPECTED_MARIKA_LIST, EXPECTED_CATE_LIST);
    assertEquals(expected, reader.readAll());
  }

  @Test
  public void close() throws IOException, DataFormatException {
    reader.close();
    assertNull(reader.readNext());
    assertEquals(List.of(), reader.readAll());
  }

  @Test
  public void readAddresses() throws IOException, DataFormatException {
    List<List<String>> allAddresses = List.of(
        List.of("John", "Doe", "120 jefferson st.", "Riverside", "NJ", "08075"),
        List.of("", "McGinnis", "220 hobo Av.", "Phila", "PA", "09119"),
        List.of("John, Da Man", "Repici", "120 Jefferson St.", "Riverside", "NJ", "08075"));
    CSVReader<List<String>> addressReader =
        CSVReader.createSimpleReaderFrom("data/misc-csv/addresses.csv");

    assertEquals(allAddresses, addressReader.readAll());
  }

  @Test
  public void readDifferentNumberOfTokens() throws IOException, CSVFileFormatException {
    String path = "data/misc-csv/malformed/differentNumberTokens.csv";
    CSVReader<List<String>> reader = CSVReader.createSimpleReaderFrom(path);
    // read first line successfully
    assertEquals(List.of("first", "line", "has", "5", "tokens"), reader.readNext());

    // second line has different number of tokens, can't be read
    assertThrows("Expected 5 tokens to parse but found 3. Occurred while reading line #2.",
        CSVFileFormatException.class, reader::readNext);
  }
}