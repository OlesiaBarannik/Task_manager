function sortTableByPriority() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("tasksTable"); // Get the table by ID
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            // Compare priority values (assuming they are numbers)
            x = parseInt(rows[i].cells[3].innerHTML.trim());
            y = parseInt(rows[i + 1].cells[3].innerHTML.trim());
            if (x > y) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}