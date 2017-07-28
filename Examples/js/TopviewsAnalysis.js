(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "rank",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "article",
            alias: "article",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "views",
            alias: "longitude",
            dataType: tableau.dataTypeEnum.float
        }];

        var tableSchema = {
            id: "topviewsFeed",
            alias: "Most viewed pages",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://wikimedia.org/api/rest_v1/metrics/pageviews/top/et.wikipedia/all-access/2017/07/27", function(resp) {
            var feat = resp.items.articles,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "rank": feat[i].rank,
                    "article": feat[i].article,
                    "views": feat[i].views
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Topviews feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
