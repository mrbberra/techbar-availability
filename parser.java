import java.util.*;
import java.io.*;
import java.net.*;
import java.lang.*;

// additional package - simple-json
import org.json.simple.*;

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
    public String get_name() { return name; }
    public String get_bib() { return bib; }
    public int get_avail() { return avail; }
    public void set_avail(int i) {
        this.avail = i;
    }
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

    public String get_name() { return name; }
    public LinkedList get_items() { return items; }
    public int get_num_items() { return num_items; }

    public void add_item(item i) {
        this.items.add(i);
        this.num_items += 1;
    }
}

/* *************************************************
                     Initializers
   ************************************************* */
class file_items {
    private LinkedList groups;
    private int num_groups;

    public file_items() {
        this.groups = new LinkedList();
        this.num_groups = 0;
    }
    
    public void add_group(group g) {
        this.groups.add(g);
        this.num_groups += 1;
    }
    public LinkedList get_group() { return groups; }
    public int get_num_groups() { return num_groups; }


    public void fetch_items() {
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
                    this.add_group(currGroup);
                }
                else {
                    /* create an item class for each item */
                    String[] parts = ln.split(",");
                    currGroup.add_item(new item(parts[0],parts[1]));
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

/* *************************************************
                   Get Avaliability
   ************************************************* */
    private String base_url = "http://www.lib.uchicago.edu/public/copyavailability/?bib=";
    
    private String get_url(String url_str){
        URL url;
        HttpURLConnection conn;
        BufferedReader rd;
        String line;
        StringBuilder page = new StringBuilder();
        try {
            url = new URL(url_str);
            conn = (HttpURLConnection) url.openConnection();
            rd = new BufferedReader (new InputStreamReader(conn.getInputStream()));
            while ((line = rd.readLine()) != null){
                page.append(line);
            }
            rd.close();
        } catch (IOException ioe) {
            System.err.println("IO Exception" + ioe.getMessage());
        } catch (Exception e){
            System.err.println("Exception" + e.getMessage());
        }
        return page.toString();
    }

    private void parse_bib_page(String bib_page, item curr_item){
        Object obj = JSONValue.parse(bib_page);

        JSONArray array = (JSONArray)obj;

        /* need to rename this, but can't think of better name than item which 
           requires a rename of the group and item struct */
        JSONObject curr_itm = null; 
        int available = 0;

        /* iterates through list of objects and checks availability */
        for (ListIterator items_itr = array.listIterator(); items_itr.hasNext();){
            curr_itm = (JSONObject)items_itr.next();
            if (curr_itm.get("available").toString().equals("true")){
                available++;
            }
        }

        curr_item.set_avail(available);
    }

    public void get_availability() {
        group curr_group = null;
        item curr_item = null;
        String item_url = "";
        String item_page = "";

        for (ListIterator groups_itr = groups.listIterator(); groups_itr.hasNext();){
            curr_group = (group) groups_itr.next();
            System.out.println(curr_group.get_name());

            for (ListIterator items_itr = curr_group.get_items().listIterator(); items_itr.hasNext();){
                curr_item = (item) items_itr.next();
                item_url = base_url.concat(curr_item.get_bib());
                item_page = get_url(item_url);
                parse_bib_page(item_page, curr_item);
                System.out.println(curr_item.get_name() +" : " + String.valueOf(curr_item.get_avail()));
            }
        }
    }

    public static void main(String[] args){
        file_items f = new file_items();

        f.fetch_items();

        f.get_availability();
    }
}


/* *************************************************
                    Make it Pretty
   ************************************************* */



