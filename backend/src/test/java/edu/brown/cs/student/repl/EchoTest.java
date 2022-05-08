package edu.brown.cs.student.repl;

import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class EchoTest {
  @Test
  public void testExecute() {
    assertEquals("", Echo.INSTANCE.execute(new String[] {""}));
    assertEquals("aWord", Echo.INSTANCE.execute(new String[] {"aWord"}));
    assertEquals("multiple words",
        Echo.INSTANCE.execute(new String[] {"multiple", "words"}));
    assertEquals("extra   spaces",
        Echo.INSTANCE.execute(new String[] {"extra", "", "", "spaces"}));
    assertEquals("a lot of many words! (5)",
        Echo.INSTANCE.execute(new String[] {"a", "lot", "of", "many", "words!", "(5)"}));
  }
}
