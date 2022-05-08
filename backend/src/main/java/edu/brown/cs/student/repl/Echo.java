package edu.brown.cs.student.repl;


/**
 * A command that simply returns its arguments as a single string.
 */
public enum Echo implements Command {
  INSTANCE;

  private static final String COMMAND_NAME = "echo";

  /**
   * Returns the arguments that were passed in.
   *
   * @param args a string array containing any arguments for the command
   * @return     a space-separated string consisting of the arguments
   */
  @Override
  public String execute(String[] args) {
    StringBuilder output = new StringBuilder();
    for (String arg : args) {
      output.append(arg);
      output.append(" ");
    }
    return output.toString().strip();
  }

  @Override
  public String getName() {
    return COMMAND_NAME;
  }

  @Override
  public String getUsage() {
    return COMMAND_NAME + " [args...]";
  }
}
