package edu.brown.cs.student.repl;

/**
 * An executable command to run in the repl.
 *
 * @see Repl
 */
public interface Command {
  /**
   * Runs the command with the specified arguments.
   *
   * @param args a string array containing any arguments for the command
   * @return     A message to be shown to the user about the results of the command.
   *             An empty string or null return value will be interpreted as no message.
   * @throws IllegalArgumentException if the passed in arguments are malformed. The message
   *                                  contained in the exception can optionally provide additional
   *                                  information to display to the user regarding the specific
   *                                  error in argument formatting.
   */
  String execute(String[] args);

  /**
   * Return the name used to call the command in the Repl.
   *
   * @return the name used by the user to call the command
   */
  String getName();

  /**
   * Return a message describing proper usage of the command. A message of the following
   * format will be displayed to the user if {@code execute} throws an IllegalArgumentException e:
   * {@code "ERROR: Incorrect use of <getName()>.
   * Expected usage: <getUsage()>. <optional e.getMessage()>”}
   *
   * @return a message describing the correct arguments parameters to the command
   */
  String getUsage();
}
