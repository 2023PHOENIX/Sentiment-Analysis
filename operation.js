const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const request = require("request");
const sentiment = require("node-sentiment");

const createCsvWriter = require("csv-writer").createObjectCsvWriter;



function extractData(filename) {
  let data = fs.readFileSync("./" + filename, "utf-8");
  // console.log(data);
  let $ = cheerio.load(data);

  let comment = $("div.C4VMK span");

  if (!fs.existsSync("./responses")) {
    fs.mkdirSync("responses");
  }

  let name = filename.split(".")[0];
  let fullPath = "./" + "responses" + "/" + name + ".csv";
  let csvWriter;
  
  let DATA = [];
  for (let i = 1; i < comment.length; i++) {
    if (i % 2 == 0 && i != 2) {
      let txt = $(comment[i]).text();
    //   console.log(txt + "\n");
      let review = sentiment(txt);
    //   console.log(review.vote);
        DATA.push({cmt :txt,review : review.vote});
    }
  }

  console.log(DATA);

  if (!fs.existsSync(fullPath)) {
    csvWriter = createCsvWriter({
        path: fullPath,
        header: [
          { id: "cmt", title: "comment" },
          { id: "review", title: "Review" },
        ],
      });


      csvWriter.writeRecords(DATA).then(()=> console.log('The CSV file was written successfully'));
  }
}

// extractData("mdshami.11.html");

module.exports = {
  extractData: extractData,
};
