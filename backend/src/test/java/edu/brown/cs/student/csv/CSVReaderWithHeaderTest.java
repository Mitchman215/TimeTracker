package edu.brown.cs.student.csv;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.FileReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.zip.DataFormatException;

import static org.junit.Assert.assertEquals;

public class CSVReaderWithHeaderTest {

  static final String STUDENT_HEADER = "id,name,email,gender,class_year,ssn,nationality,race,"
      + "years_experience,communication_style,weekly_avail_hours,meeting_style,meeting_time,"
      + "software_engn_confidence,strengths,weaknesses,skills,interests";

  private CSVReaderWithHeader<Map<String, String>> reader;

  @Before
  public void setUp() throws Exception {
    reader = new CSVReaderWithHeader<>(new FileReader("data/project1/proj1_big.csv"),
        STUDENT_HEADER, new CSVParseByField(STUDENT_HEADER));
  }

  @After
  public void tearDown() throws Exception {
    reader.close();
    reader = null;
  }

  @Test
  public void testNumberParsed() throws DataFormatException, IOException {
    List<Map<String, String>> students = reader.readAll();
    assertEquals(500, students.size());
  }

  @Test
  public void testReadNextThenReadAll() throws DataFormatException, IOException {
    Map<String, String> student1 = reader.readNext();
    assert student1 != null;
    assertEquals(18, student1.size());

    reader.readNext();

    List<Map<String, String>> students = reader.readAll();
    assertEquals(498, students.size());
  }
}