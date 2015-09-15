/*  creates a js object organizing items by group/classification
    each item includes: name, bib number
    ie: "Laptops"
            - "Macbook Air MS2","8513330"
            ...
        "Chargers"
            - "2-hour MS1 Adapter","8509957"
            ...
        ...
    first we get all the groups, names, and bib numbers,
    then we use that to make requests and parse the ReSTful
    responses to get and update the availability.
*/


/*  creating the data arrays: its ugly and im sorry
    commented items will be properly added when i get the bib numbers
*/

function createGroups() {
    var grs =
        [{group:"Laptops and iPads",items:[
            //{name:"Macbook Air MS1",bib:""},
            //{name:"Macbook Pro",bib:""},
            {name:"Macbook Air MS2",bib:"8513330"},
            {name:"Dell XPS",bib:"8948289"},
            {name:"iPad",bib:"8966833"}]},
         {group:"2-hour Chargers",items:[
            {name:"2-hour MS1 Adapter",bib:"8509957"},
            {name:"2-hour MS2 Adapter",bib:"9864660"},
            {name:"Mini-USB charger",bib:"8920736"},
            {name:"Micro-USB charger",bib:"8916813"},
            {name:"Apple Lightning charger",bib:"8968294"}]},
            //{name:"Universal PC Adapter",bib:""},
         {group:"Video Adapters and Cables",items:[
            {name:"HDMI cable",bib:"8690270"},
            {name:"USB to VGA",bib:"8509852"},
            {name:"Mini DisplayPort to HDMI",bib:"8509847"},
            {name:"Mini DVI to VGA",bib:"8509108"},
            {name:"Universal DisplayPort to HDMI",bib:"10108672"},
            {name:"PC DisplayPort to HDMI",bib:"10108673"},
            {name:"PC DisplayPort to VGA",bib:"10108674"}]},
         {group:"Data Cables",items:[
            {name:"Ethernet cable 25ft",bib:"8516685"},
            {name:"Ethernet cable 10ft",bib:"8516696"},
            {name:"FireWire 800",bib:"8532264"},
            {name:"FireWire 400",bib:"8920709"},
            {name:"FireWire 800/400 adapter",bib:"8532262"},
            {name:"Thunderbolt cable",bib:"8690269"},
            {name:"Apple USB to Ethernet adapter",bib:"8903640"},
            {name:"Apple Thunderbolt to Ethernet Adapter",bib:"10115654"}]}];
    return grs;
}

/*  makes XMLHttpRequest to get JSON response from server,
    updates html for specific item's listing on page
    things we might add: next due times?
    also, right now we are working with a JSON feed that is buggy,
    so the parsing might change
*/
function getJSONfromURL(url, groupId, itemId) {
    var avail = 0,tot = 0;
    var itemEl;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            for(var i = 0, tot = response.length; i < tot; i++) {
                if(response[i].available) {
                    ++avail;
                }
            }
            itemEl = document.getElementById("item-list-" + groupId.toString() + "-" + itemId.toString());
            
            itemEl.children[0].children[0].innerHTML = "Available : " + avail;

        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}


/*  calls the getJSON function for every item, gets called regularly  */
function updateAvail(groups) {
    for (var i = 0, len = groups.length; i < len; i++) {
        var currGroup = groups[i];
        for(var j = 0; j < currGroup.items.length; j++) {
            currItem = currGroup.items[j];
            var url = "http://www.lib.uchicago.edu/public/copyavailability/?bib=" + currItem.bib;
            var response = getJSONfromURL(url, i, j);
        }
    }
}


/*  sets up display
    ~~~ ui is my passion ( ͡° ͜ʖ ͡°) ~~~  */
function displayGroup(groups) {
    var groupsEl = document.getElementById('groups-list');
    var groupEl;
    if (groupsEl){
        var anode, fnode, lnode, snode, dnode, node, groupId, innerNode, itemInfo, itemId;
        for (var i = 0, len = groups.length; i < len; i++) {
            // set up divs n shit for css
            groupEl = document.getElementById(groupId);
            fnode = document.createElement("fieldset");
            fnode.setAttribute("class", "collapse-text-fieldset collapsible collapsed form-wrapper collapse-processed");
            fnode.setAttribute("onclick", "Drupal.toggleFieldset(this)");
            
            lnode = document.createElement("legend");

            groupId = "group-list-" + i.toString();
            snode = document.createElement("span");
            snode.setAttribute("class", "fieldset-legend");
            
            anode = document.createElement("a");
            anode.setAttribute("class", "fieldset-title");
            anode.setAttribute("id", groupId);
            anode.innerHTML = groups[i].group;
            
            dnode = document.createElement("div");
            dnode.setAttribute("class", "fieldset-wrapper");

            node = document.createElement("div");
            node.setAttribute("class", "collapse-text-text");

            snode.appendChild(anode);
            fnode.appendChild(lnode);
            dnode.appendChild(node);
            lnode.appendChild(snode);
            fnode.appendChild(dnode);
            groupsEl.appendChild(fnode);

            for (var j = 0, iLen = groups[i].items.length; j < iLen; j++) {
                innerNode = document.createElement("tr");
                itemId = "item-list-" + i.toString() + "-" + j.toString();
                innerNode.setAttribute("id", itemId);
                innerNode.innerHTML = groups[i].items[j].name + "<ul><li>Available : - </li></ul>";
                node.appendChild(innerNode); 
            }
        }
    }
}

jQuery(document).ready(function() {
    var allTheThings = createGroups();
    displayGroup(allTheThings);
    updateAvail(allTheThings);
    setInterval(updateAvail, 45000, allTheThings); /* updates every 45 seconds */
});



