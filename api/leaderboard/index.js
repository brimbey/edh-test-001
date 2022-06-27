const data = require('@begin/data')
const dynamo = require('@begin/data/src/helpers/_dynamo').doc
let getTableName = require('@begin/data/src/helpers/_get-table-name')
let getKey = require('@begin/data/src/helpers/_get-key')
let arc = require('@architect/functions');
// const { APIUtils } = require('../common/APIUtils');
let parseBody = arc.http.helpers.bodyParser


const prettyPrintJSON = (json) => {
  console.log(`${JSON.stringify(json, null, 4)}`);
}

const formatSalt = (value) => {
    return Math.ceil(value * 10000) / 10000;
}

const getSaltList = async () => {
  let cached = {};

  try {
    cached = await data.get({
      table: 'decks_v3',
    });
  } catch (error) {
    cached = stubData;
  }

  let retData = [];

  try {
    retData = cached.map((deck) => {
        return {
            ...deck,
            id: deck.id,
        }
    });

    // retData = retData.sort((a, b) => {
    //     return b?.salt - a?.salt;
    // });
  } catch (error) {
    console.log(`[ERROR] ${error}`);
    retData = [];
  }

  // default
  return retData;
}

exports.handler = async function http () {
  const list = await getSaltList();

  return {
    headers: {
      'content-type': 'application/json; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    statusCode: 200,
    body: JSON.stringify(list)
  }
}

