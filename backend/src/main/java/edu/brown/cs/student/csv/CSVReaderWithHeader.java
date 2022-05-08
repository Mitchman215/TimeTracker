package edu.brown.cs.student.csv;

import edu.brown.cs.student.csv.exceptions.CSVFileFormatException;

import java.io.IOException;
import java.io.Reader;
import java.util.List;
import java.util.Map;
import java.util.zip.DataFormatException;

/**
 * A CSVReader variant for CSV files that have headers at the top.
 *
 * @param <T> the type of object created by the CSVReader
 */
public class CSVReaderWithHeader<T> extends CSVReader<T> {

  /**
   * Creates a new CSVReaderWithHeader.
   *
   * @param reader         the reader from which CSV data is read from
   * @param expectedHeader a string of the header in the CSV file to be read
   * @param parser         the parser used to create objects from the student data
   * @throws IllegalArgumentException if the header in the file doesn't match the expected one
   * @throws IOException              if an I/O error occurs
   * @throws CSVFileFormatException   if the CSV file has a formatting error
   */
  public CSVReaderWithHeader(Reader reader, String expectedHeader, CSVParser<T> parser)
      throws IOException, CSVFileFormatException {
    super(reader, parser);

    // check that the header in the file matches the expected header
    String header = getReader().readLine();
    if (!expectedHeader.equals(header)) {
      throw new CSVFileFormatException(0, null, "Was expecting the header \""
          + expectedHeader + "\".");
    }
  }

  /**
   * Creates a CSVReader for the CSV file located at the path, assuming the file has a header and
   * regular CSV formatting (with commas and quotes as separators and enclosing characters
   * respectively). Automatically uses the header to infer the fields represented by the columns.
   *
   * @param path the path to the CSV file to be parsed (relative to the project directory)
   * @return     a CSVReaderWithHeader for the file
   * @throws IOException if an I/O error occurs, such as not being able to find the file
   */
  public static CSVReader<Map<String, String>> from(String path)
      throws IOException {
    try (var readHeader = createSimpleReaderFrom(path)) {
      // read in and parse the header
      List<String> fields = readHeader.readNext();
      // return new CSVReader
      return new CSVReader<>(readHeader, new CSVParseByField(fields));
    } catch (DataFormatException e) {
      e.printStackTrace();
    }
    // should never reach here
    throw new AssertionError("Unable to create csvReader, should not reach");
  }
}
