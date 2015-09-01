/*  creates a js object organizing items by group/classification
    each item includes: name, bib number, number of items available,
                        total number of items, and approaching due times
    ie: "Laptops"
            - "Macbook Air MS2","8513330","5"
            ...
        "Chargers"
            - "2-hour MS1 Adapter","8509957","3"
            ...
        ...
    first we get all the groups, names, and bib numbers,
    then we use that to get and update the availability.
*/


/*  creating the data arrays: its ugly and im sorry
    sets availability to 0 for everything for now
    commented items will be properly added when i get the bib numbers
*/
function createGroups() {
    var grs =
        [{group:"Laptops and iPads",items:[
            //{name:"Macbook Air MS1",bib:"",avail:0,total:0,nextdue:[]},
            //{name:"Macbook Pro",bib:"",avail:0,total:0,nextdue:[]},
            {name:"Macbook Air MS2",bib:"8513330",avail:0,total:0,nextdue:[]},
            {name:"Dell XPS",bib:"8948289",avail:0,total:0,nextdue:[]},
            {name:"iPad",bib:"8966833",avail:0,total:0,nextdue:[]}]},
         {group:"2-hour Chargers",items:[
            {name:"2-hour MS1 Adapter",bib:"8509957",avail:0,total:0,nextdue:[]},
            {name:"2-hour MS2 Adapter",bib:"9864660",avail:0,total:0,nextdue:[]},
            {name:"Mini-USB charger",bib:"8920736",avail:0,total:0,nextdue:[]},
            {name:"Micro-USB charger",bib:"8916813",avail:0,total:0,nextdue:[]},
            {name:"Apple Lightning charger",bib:"8968294",avail:0,total:0,nextdue:[]}]},
            //{name:"Universal PC Adapter",bib:"",avail:0,total:0,nextdue:[]},
         {group:"Video Adapters and Cables",items:[
            {name:"HDMI cable",bib:"8690270",avail:0,total:0,nextdue:[]},
            {name:"USB to VGA",bib:"8509852",avail:0,total:0,nextdue:[]},
            {name:"Mini DisplayPort to HDMI",bib:"8509847",avail:0,total:0,nextdue:[]},
            {name:"Mini DVI to VGA",bib:"8509108",avail:0,total:0,nextdue:[]},
            {name:"Universal DisplayPort to HDMI",bib:"10108672",avail:0,total:0,nextdue:[]},
            {name:"PC DisplayPort to HDMI",bib:"10108673",avail:0,total:0,nextdue:[]},
            {name:"PC DisplayPort to VGA",bib:"10108674",avail:0,total:0,nextdue:[]}]},
         {group:"Data Cables",items:[
            {name:"Ethernet cable 25ft",bib:"8516685",avail:0,total:0,nextdue:[]},
            {name:"Ethernet cable 10ft",bib:"8516696",avail:0,total:0,nextdue:[]},
            {name:"FireWire 800",bib:"8532264",avail:0,total:0,nextdue:[]},
            {name:"FireWire 400",bib:"8920709",avail:0,total:0,nextdue:[]},
            {name:"FireWire 800/400 adapter",bib:"8532262",avail:0,total:0,nextdue:[]},
            {name:"Thunderbolt cable",bib:"8690269",avail:0,total:0,nextdue:[]},
            {name:"Apple USB to Ethernet adapter",bib:"8903640",avail:0,total:0,nextdue:[]},
            {name:"Apple Thunderbolt to Ethernet Adapter",bib:"10115654",avail:0,total:0,nextdue:[]}]}];
    return grs;
}

/*  makes XMLHttpRequest to get JSON response from server,
    returns object with current availability, total num items, and next 3 due dates
    well right now it doesnt do due dates but it will soon!
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
            itemEl.children[0].children[1].innerHTML = "Total : " + tot;
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    //return {available:avail,total:tot,dues:[]};
}


/*  adds/updates availability for each item, gets called regularly  */
function updateAvail(groups) {
    for (var i = 0, len = groups.length; i < len; i++) {
        var currGroup = groups[i];
        for(var j = 0; j < currGroup.items.length; j++) {
            currItem = currGroup.items[j];
            var url = "http://www.lib.uchicago.edu/public/copyavailability/?bib=" + currItem.bib;
            var response = getJSONfromURL(url, i, j);
            //currItem.avail=response.available;
            //currItem.total=response.total;
            //currItem.nextdue=response.dues;
        }
    }
}

/*  sets up display  */

function displayGroup(groups) {
    var groupsEl = document.getElementById('groups-list');
    var groupEl;
    if (groupsEl){
        var node, groupId, innerNode, itemInfo, itemId;
        for (var i = 0, len = groups.length; i < len; i++) {
            node = document.createElement("div");
            groupId = "group-list-" + i.toString();
            node.setAttribute("id", groupId);
            node.innerHTML = groups[i].group;
            groupsEl.appendChild(node);
            groupEl = document.getElementById(groupId);

            for (var j = 0, iLen = groups[i].items.length; j < iLen; j++) {
                innerNode = document.createElement("li");
                itemId = "item-list-" + i.toString() + "-" + j.toString();
                innerNode.setAttribute("id", itemId);
                innerNode.innerHTML = groups[i].items[j].name + 
                                    "<ul><li>" + "Available : " + groups[i].items[j].avail + "</li>" +
                                    "<li>" + "Total : " + groups[i].items[j].total + "</li></ul>";
                groupEl.appendChild(innerNode);
            }
        }
    }
}


/*  cycles between which group is displayed  */
function changeGroup(groups) {
    var currGroup = groups[cycle];
    displayGroup(currGroup);
    ++cycle;
}

// /*  all together now  */
// var allTheThings = createGroups()
// setInterval(updateAvail,60000,allTheThings); //update availability info every minute
// var cycle = 0;
// setInterval(changeGroup,15000,allTheThings); //change which group is displayed every 15 seconds

window.onload = function() {
    var allTheThings = createGroups();
    displayGroup(allTheThings);
    updateAvail(allTheThings);
}


