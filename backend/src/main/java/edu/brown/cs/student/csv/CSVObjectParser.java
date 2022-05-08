package edu.brown.cs.student.csv;

import edu.brown.cs.student.csv.exceptions.FieldParsingException;
import edu.brown.cs.student.csv.exceptions.MissingFieldException;
import edu.brown.cs.student.csv.exceptions.WrongNumberOfTokensException;

import java.util.Map;

/**
 * A CSVParser that creates objects of a specific type using an ObjectParser.
 *
 * @param <T> the type of object created by this CSVObjectParser
 * @see ObjectParser
 */
public class CSVObjectParser<T> implements CSVParser<T> {

  private final CSVParseByField parseByField;

  private final ObjectParser<T> objectParser;

  /**
   * Creates a new CSVObjectParser with the specified object parser
   * for a file with the given header.
   *
   * @param objectParser the object parser used to create objects from the CSV data
   * @param header       the header in the CSV file data is being parsed from
   * @param enclosingRegex  the regex to be matched as the primary delimiter for splitting lines
   * @param separatingRegex the regex to be matched as the secondary delimiter for splitting lines
   */
  public CSVObjectParser(ObjectParser<T> objectParser, String header,
                         String enclosingRegex, String separatingRegex) {
    this.parseByField = new CSVParseByField(header, enclosingRegex, separatingRegex);
    this.objectParser = objectParser;
  }

  /**
   * Creates a new CSVObjectParser with the specified object parser
   * for a regular CSV file with the given header.
   *
   * @param objectParser the object parser used to create objects from the CSV data
   * @param header       the header in the CSV file data is being parsed from
   */
  public CSVObjectParser(ObjectParser<T> objectParser, String header) {
    this(objectParser, header, CSVParser.DEFAULT_ENCLOSING_REGEX,
        CSVParser.DEFAULT_SEPARATING_REGEX);
  }

  @Override
  public T parseLine(String line)
      throws WrongNumberOfTokensException, FieldParsingException, MissingFieldException {
    Map<String, String> fieldMap = parseByField.parseLine(line);
    return objectParser.parseObject(fieldMap);
  }
}
