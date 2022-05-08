package edu.brown.cs.student.csv;

import org.junit.Test;

import java.util.List;
import java.util.function.Function;

import static org.junit.Assert.assertEquals;

public class CSVParserTest {

  @Test
  public void defaultSplitter() {
    String customInput = " second,token,\"more than one, word\",final \\ token's ";
    List<String> customResult = CSVParser.DEFAULT_SPLITTER.apply(customInput);
    List<String> customExpected = List.of(
        " second", "token", "more than one, word", "final \\ token's ");
    assertEquals(customExpected, customResult);

    String inputCSV = "1,Stanton Swalough,sswalough0@ask.com,Female,junior,375-75-3870,"
        + "Russia,American Indian or Alaska Native,18,email,2,in person,morning,2,"
        + "\"quick learner, prepared, team player, early starter, friendly\","
        + "\"cutthroat, unfriendly, late\",OOP,\"mathematics, film/photography, politics\"";
    List<String> resultCSV = CSVParser.DEFAULT_SPLITTER.apply(inputCSV);
    assertEquals(CSVReaderTest.EXPECTED_STANTON_LIST, resultCSV);
  }

  @Test
  public void emptyField() {
    String input = ",,\"two,,tokens\",,final";
    List<String> result = CSVParser.DEFAULT_SPLITTER.apply(input);
    List<String> expected = List.of(
        "", "", "two,,tokens", "", "final");
    assertEquals(expected, result);
  }

  // test borrowed from source of regex:
  // https://gist.github.com/awwsmm/886ac0ce0cef517ad7092915f708175f
  @Test
  public void manyQuotes() {
    String input = "\"\"\"test\"\" one\",test' two,\"\"\"test\"\" 'three'\",\"\"\"test 'four'\"\"\"";
    List<String> result = CSVParser.DEFAULT_SPLITTER.apply(input);
    List<String> expected = List.of(
        "\"\"test\"\" one", "test' two", "\"\"test\"\" 'three'", "\"\"test 'four'\"\"");
    assertEquals(expected, result);
  }

  @Test
  public void customStringSplitter() {
    Function<String, List<String>> customSplitter =
        CSVParser.createStringSplitter("'", "[0-9]", true);
    String customInput = "How are y0u splitting this? 0n 1'num5ers'7 12 weird";
    List<String> customExpected = List.of(
        "How are y", "u splitting this? ", "n ", "'num5ers'", " ", "", " weird");
    List<String> customResult = customSplitter.apply(customInput);
    assertEquals(customExpected, customResult);
  }

  @Test
  public void replStringSplitter() {
    Function<String, List<String>> customSplitter =
        CSVParser.createStringSplitter("\"", "\\s", true);
    String customInput = "naive_neighbors 29 \"name here\"";
    List<String> customExpected = List.of("naive_neighbors", "29", "\"name here\"");
    List<String> customResult = customSplitter.apply(customInput);
    assertEquals(customExpected, customResult);
  }
}