package edu.brown.cs.student.csv;

import edu.brown.cs.student.csv.exceptions.WrongNumberOfTokensException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * A CSVParser that parses each line of a CSV file into a map where the value is
 * the string token and the key is the name of the field that corresponds to the token.
 */
public class CSVParseByField implements CSVParser<Map<String, String>> {

  /**
   * A default parser used to parse lines into a list of strings.
   */
  private final CSVDefaultParser parseToStringList;

  /**
   * Stores the names of the fields in the CSV file in the order that they appear.
   */
  private final List<String> fieldNames;

  /**
   * The number of fields expected in a line (regardless of how many fields are to be used).
   */
  private final int numberAllFields;

  /**
   * Creates a CSVParser that splits tokens on lines according to the specified delimiters
   * for a CSV file with the specified field names.
   *
   * @param allFieldNames   a list of all the names of the fields in the CSV file to be parsed
   *                        ordered according to how the fields appear in the file
   * @param enclosingRegex  the regex to be matched as the primary delimiter for splitting lines
   * @param separatingRegex the regex to be matched as the secondary delimiter for splitting lines
   */
  public CSVParseByField(List<String> allFieldNames, String enclosingRegex,
                         String separatingRegex) {
    this.parseToStringList = new CSVDefaultParser(enclosingRegex, separatingRegex);
    this.numberAllFields = allFieldNames.size();
    this.fieldNames = allFieldNames;
  }

  /**
   * Creates a CSVParser that splits tokens on lines according to the specified delimiters
   * for a CSV file with the specified header.
   *
   * @param header          the header of the CSV file
   * @param enclosingRegex  the regex to be matched as the primary delimiter for splitting lines
   * @param separatingRegex the regex to be matched as the secondary delimiter for splitting lines
   */
  public CSVParseByField(String header, String enclosingRegex, String separatingRegex) {
    this.parseToStringList = new CSVDefaultParser(enclosingRegex, separatingRegex);
    List<String> allFieldNames = parseToStringList.splitLine(header);
    this.numberAllFields = allFieldNames.size();
    this.fieldNames = allFieldNames;
  }

  /**
   * Creates a CSVParser that splits tokens based on commas and quotes
   * for a CSV file with the specified field names.
   *
   * @param allFieldNames a list of all the names of the fields in the CSV file to be parsed
   *                      ordered according to how the fields appear in the file
   */
  public CSVParseByField(List<String> allFieldNames) {
    this(allFieldNames, CSVParser.DEFAULT_ENCLOSING_REGEX, CSVParser.DEFAULT_SEPARATING_REGEX);
  }

  /**
   * Creates a CSVParser that splits tokens based on commas and quotes
   * for a CSV file with the specified header.
   *
   * @param header the header of the CSV file
   */
  public CSVParseByField(String header) {
    this(header, CSVParser.DEFAULT_ENCLOSING_REGEX, CSVParser.DEFAULT_SEPARATING_REGEX);
  }

  @Override
  public List<String> splitLine(String line) {
    return parseToStringList.splitLine(line);
  }

  @Override
  public Map<String, String> parseLine(String line) throws WrongNumberOfTokensException {
    List<String> tokens = parseToStringList.parseLine(line);
    // check that the line has the correct number of fields
    if (numberAllFields != tokens.size()) {
      throw new WrongNumberOfTokensException(numberAllFields, tokens.size());
    }

    Map<String, String> parsed = new HashMap<>();
    for (int i = 0; i < numberAllFields; i++) {
      parsed.put(fieldNames.get(i), tokens.get(i));
    }
    return parsed;
  }
}
