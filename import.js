'use strict';

require('./knexinit');

const axios = require("axios");
const $ = require("jquery");
const { JSDOM } = require('jsdom');

const datetimeUtils = require('./utils/datetime');
const CountryModel = require("./models/Country");
const CheckpointModel = require("./models/Checkpoint");
const RecordModel = require("./models/Record");
const directions = ["i", "o"];

importStart();

async function importStart() {
    console.log(await CheckpointModel.query());
    console.log(await RecordModel.query());
  const countries = await CountryModel.query();
  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];
    for (let j = 0; j < directions.length; j++) {
      const dir = directions[i];
      const checkpoints = await getCheckpoints(country.short, dir);
      handleCheckponts(checkpoints, country.id, dir);
    }
  }
}

async function handleCheckponts(checkpoints, countryId, direction) {
  const datetime = new Date;
  for (let i = 0; i < checkpoints.length; i++) {
    let Checkpoint = await CheckpointModel.query()
      .where('name', checkpoints[i].name);
    if (!Checkpoint[0]) {
        Checkpoint = await CheckpointModel.query()
          .insert({name: checkpoints[i].name, countryId});
        console.log("Inserted: ", Checkpoint);
    } else {
      Checkpoint = Checkpoint[0];
    }

    const delay = datetimeUtils.hhmm2mm(checkpoints[i].time);

    if (false !== delay) {
      const Record = await RecordModel.query()
        .insert({
          checkpointId: Checkpoint.id,
          direction,
          datetime,
          delay
        });
      console.log("Inserted: ", Record);
    }
  }
}

async function getCheckpoints(country, direction) {
    const $rows = await getTableRows({country, direction});
    const checkpoints = [];
    $rows.each(function () {
        const post = {
            name: this.children[0].innerHTML,
            time: this.children[1].innerHTML,
        }
        checkpoints.push(post);
    })
    return checkpoints;
}

async function getTableRows(options) {
    const html = await getHtml(options);
    const { window } = new JSDOM(html);;
    const $html = $(window)(html);
    const $rows = $html.find("table.responsive tbody tr");
    return $rows;
}

async function getHtml(options) {
    let url = "http://kordon.sfs.gov.ua/ru/home/countries/" + 
    options.country + "/" + options.direction;
    return (await axios.get(url)).data;
}

