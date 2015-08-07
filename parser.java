import java.util.*;
import java.io.*;

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
    private LinkedList items;
    private int num_items;

    public group(String name) {
        this.name = name;
        this.items = new LinkedList();
        this.num_items = 0;
    }

    public String getName() { return name; }
    public LinkedList getItems() { return items; }
    public int getNum_Items() { return num_items; }

    public void addItem(item i) {
        this.items.add(i);
        this.num_items += 1;
    }
}

/* *************************************************
                     Initializers
   ************************************************* */
class fileItems {
    private LinkedList groups;
    private int num_groups;

    public fileItems() {
        this.groups = new LinkedList();
        this.num_groups = 0;
    }
    
    public void addGroup(group g) {
        this.groups.add(g);
        this.num_groups += 1;
    }
    public LinkedList getGroups() { return groups; }
    public int getNum_Groups() { return num_groups; }


    public void fetchItems() {
        /* read csv file of names and bib numbers */
        BufferedReader reader;
        String ln;
        String title;
        String bibno;
        group currGroup = null;
        try {
            reader = new BufferedReader(new FileReader("biblist.csv"));
            while ((ln = reader.readLine()) != null) {
                if (ln.isEmpty()) {}
                else if (ln.substring(0,2).equals("//")) {
                    /* create a group class for each group */
                    title = ln.substring(3,(ln.length()-3));
                    currGroup = new group(title);
                    this.addGroup(currGroup);
                }
                else {
                    /* create an item class for each item */
                    String[] parts = ln.split(",");
                    currGroup.addItem(new item(parts[0],parts[1]));
                }
            }
        }
        catch (FileNotFoundException fne) {
            System.err.println("File Not Found Exception: " + fne.getMessage());
        }
        catch (IOException ioe) {
            System.err.println("IO Exception" + ioe.getMessage());
        }
    }
}
/* *************************************************
                   Get Avaliability
   ************************************************* */



/* *************************************************
                    Make it Pretty
   ************************************************* */
