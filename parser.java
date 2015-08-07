/* read csv file of items and bib numbers */
/* create class to hold title, bib number and availability.
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

/* create class to hold all items of a group */
class group {
    private list
}
