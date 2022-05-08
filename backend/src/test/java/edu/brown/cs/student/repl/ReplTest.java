package edu.brown.cs.student.repl;

import static org.junit.Assert.assertEquals;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class ReplTest {

  private Repl repl;

  @Before
  public void setup() {
    repl = new Repl();
  }

  @After
  public void tearDown() {
    repl = null;
  }

  @Test
  public void testProcessInputInvalidCommand() {
    String errorNoCommand = "ERROR: No command or arguments entered";
    assertEquals(errorNoCommand, repl.processInput(null));
    assertEquals(errorNoCommand, repl.processInput(""));
    assertEquals(errorNoCommand, repl.processInput(" "));
    assertEquals(errorNoCommand, repl.processInput("  "));
    assertEquals(errorNoCommand, repl.processInput("\n"));

    assertEquals("ERROR: Unknown command: \":\"", repl.processInput(": stars"));
    assertEquals("ERROR: Unknown command: \"fake\"", repl.processInput("fake"));
    assertEquals("ERROR: Unknown command: \"do\"", repl.processInput("do nothing"));
  }

  @Test
  public void testProcessInputEcho() {
    assertEquals("", repl.processInput("echo"));
    assertEquals("", repl.processInput("echo  "));
    assertEquals("hi", repl.processInput("echo hi"));
    assertEquals("hi", repl.processInput("echo  hi"));
    assertEquals("hi", repl.processInput("echo\nhi"));
    assertEquals("hi", repl.processInput("echo\thi"));
    assertEquals("echo", repl.processInput("echo echo"));
    assertEquals("comma,separated,values",
        repl.processInput("echo comma,separated,values"));

    assertEquals("hello world", repl.processInput("echo hello world"));
    assertEquals("hello world", repl.processInput("echo hello    world"));
    assertEquals("\"hello    world\"", repl.processInput("echo \"hello    world\""));
    assertEquals("Java is neat!", repl.processInput("echo Java is neat!"));
    assertEquals("1 2 3 4 5 6 7 89", repl.processInput("echo 1 2 3 4 5 6 7 89 "));
  }

}
