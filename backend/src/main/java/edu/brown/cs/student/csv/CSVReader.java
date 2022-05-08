package edu.brown.cs.student.csv;

import edu.brown.cs.student.csv.exceptions.CSVFileFormatException;

import javax.annotation.Nullable;
import java.io.BufferedReader;
import java.io.Closeable;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.DataFormatException;

/**
 * An object that reads in data from CSV files and stores them into objects.
 * Some inspiration was taken from the OpenCSV library.
 *
 * @param <T> the type of object that this CSVReader converts CSV files into,
 *            i.e. the type returned by the {@code readNext()} method.
 */
public class CSVReader<T> implements Closeable {

  /**
   * Used to read in the CSV file.
   */
  private final BufferedReader reader;

  /**
   * Used to parse individual lines in the CSV file, creating objects of type T.
   */
  private final CSVParser<T> parser;

  /**
   * Whether this CSVReader is closed. Once closed, no other methods can be called.
   */
  private boolean isClosed = false;

  /**
   * Keeps track of the line that the reader is at. Used for debugging.
   */
  private int currentLine = 0;

  /**
   * Create a new CSVReader that uses the specified reader and parser.
   *
   * @param reader the reader used to read the CSV file.
   * @param parser the parser used to create objects from each line of the CSV file.
   */
  CSVReader(Reader reader, CSVParser<T> parser) {
    this.reader = new BufferedReader(reader);
    this.parser = parser;
  }

  /**
   * Create a new CSVReader from the same source as another CSVReader, but with a different parser.
   * Can be used to switch parsers as reading (for example after reading in a header).
   *
   * @param csvReader the CSVReader whose reader to use.
   * @param parser    the parser used to create objects from each line of the CSV file.
   */
  CSVReader(CSVReader<?> csvReader, CSVParser<T> parser) {
    this.reader = csvReader.reader;
    this.parser = parser;
  }

  /**
   * Getter for the reader for use in a subclass.
   *
   * @return this CSVReader's reader object
   */
  protected BufferedReader getReader() {
    return reader;
  }

  /**
   * Getter for the parser for used in a subclass.
   *
   * @return this CSVReader's parser object
   */
  protected CSVParser<T> getParser() {
    return parser;
  }

  /**
   * Reads in the next line of a CSV file and parses it using this CSVReader's parser.
   *
   * @return the object of type T created by the parser, or null if the end
   * of the CSV file has been reached or if the CSVReader is closed.
   * @throws IOException if an I/O error occurs
   * @throws CSVFileFormatException if the data in the CSV file is not formatted correctly
   */
  @Nullable
  public T readNext() throws IOException, CSVFileFormatException {
    if (isClosed) {
      return null;
    }
    try {
      String nextLine = reader.readLine();
      if (nextLine == null) {
        // end of file reached
        return null;
      } else {
        // successful read
        currentLine++;
        return parser.parseLine(nextLine);
      }
    } catch (DataFormatException e) {
      throw new CSVFileFormatException(currentLine, null, e);
    }
  }

  /**
   * Reads in all the remaining lines of the CSV file, parsing them using this CSVReader's parser
   * and returning all resultant parsed objects in a list.
   *
   * @return a list of the objects parsed from each line of the CSV file. Note that if the end of
   * the CSV file is immediately reached or the CSVReader is closed, an empty list will be returned
   * @throws IOException if an I/O error occurs
    @throws CSVFileFormatException if the data in the CSV file is not formatted correctly
   */
  public List<T> readAll() throws IOException, CSVFileFormatException {
    List<T> elements = new ArrayList<>();
    T nextObject = readNext();
    while (nextObject != null) {
      elements.add(nextObject);
      nextObject = readNext();
    }
    return elements;
  }

  @Override
  public void close() throws IOException {
    reader.close();
    isClosed = true;
  }

  /**
   * Creates a CSVReader with the default delimiters given a file path
   * that parses each line into a list of strings.
   *
   * @param path path to the CSV file to read from
   * @return     a CSVReader that reads from that file
   * @throws FileNotFoundException if the file path is invalid
   */
  public static CSVReader<List<String>> createSimpleReaderFrom(String path)
      throws FileNotFoundException {
    return new CSVReader<>(new FileReader(path), new CSVDefaultParser());
  }
}
