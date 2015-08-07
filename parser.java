import java.util.*;
import java.io.*

/* *************************************************
                      Data Classes
   ************************************************* */

/* item class to hold title, bib number and availability.
   availability is set to 0 initially */
class item {
    private String name;
    private String bib;
    private int avail;
    
    public item(String name,String bib) {
        this.name = name;
        this.bib = bib;
        this.avail = 0;
    }
    public String getName() { return name; }
    public String getBib() { return bib; }
    public int getAvail() { return avail; }
}

/* group class to hold all items of a certain type, i.e. Laptops */
class group {
    private String name;
    private List items;
    private int num_items;

    public group(String name) {
        this.name = name;
        this.items = new LinkedList();
        this.num_items = 0;
    }
    public String getName() { return name; }
    public LinkedList getItems() { return items; }
    public int getNum_Items() { return num_items; }
}

/* *************************************************
                     Initializers
   ************************************************* */
public class fileItems {
    private LinkedList groups;
    private int num_groups;

    public fileItems() {
        this.groups = new LinkedList();
        this.num_items = 0;
    }
    public static void getItems() {
        /* returns csv file of names and bib numbers */
        /* create an group class for each group */
        /* create an item class for each item */
    }
}
/* *************************************************
                   Get Avaliability
   ************************************************* */



/* *************************************************
                    Make it Pretty
   ************************************************* */

