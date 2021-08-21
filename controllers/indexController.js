const casesConfig = require("../configuration/cases")
const Center= require ('../models/center')
var request = require('request');

exports.getSummary = async (req,res) =>{
    var options = {
        'method': 'GET',
        'url': 'https://api.opencovid.ca/summary',
        'headers': {
        }
      }; 
      request(options, function (error, results) {
            if (error) throw new Error(error);
            const obj = JSON.parse(results.body);
            var prov = []
            var data = []
            obj[Object.keys(obj)[0]].forEach(element => {
              prov.push(element.province)
              data.push(element.active_cases)
            });
            res.locals.title = "Fight Against COVID";
            Center.find({},function(err,results)
            {
                if(err)
                {
                    console.log(err)
                    return res.status(500).json({error: 'find error'})
                }else
                {
                    results.sort((a,b)=> b.likes.length - a.likes.length)
                    var topUser = []
                    var len = (results.length <3)? results.length :3
                    var index =0;
                    var added =0;
                    while(index<results.length && added <len )
                    {
                        if(!topUser.includes(results[index].user))
                        {
                            topUser.push(results[index].user)
                            added++;
                        }
                        index ++;
                    }
                    res.render('index', { title: 'Fight Against COVID',user: req.user, data: data, label: prov, graphTitle: 'Current Active Cases', chart: 'bar', prov:'BC',stats:'none', topUser: topUser});
                }
            })
          });
}

exports.getStats = (req, res) => {
    var options = {
        'method': 'GET',
        'url': 'https://api.opencovid.ca/summary',
        'headers': {
        }
      }; 
      request(options, function (error, results) {
            if (error) throw new Error(error);
            const obj = JSON.parse(results.body);
            var prov = []
            var data = []
            obj[Object.keys(obj)[0]].forEach(element => {
              prov.push(element.province)
              data.push(element.active_cases)
            });
            res.locals.title = "Fight Against COVID";
            Center.find({},function(err,results)
            {
                if(err)
                {
                    console.log(err)
                    return res.status(500).json({error: 'find error'})
                }else
                {
                    results.sort((a,b)=> b.likes.length - a.likes.length)
                    var topUser = []
                    var len = (results.length <3)? results.length :3
                    var index =0;
                    var added =0;
                    while(index<results.length && added <len )
                    {
                        if(!topUser.includes(results[index].user))
                        {
                            topUser.push(results[index].user)
                            added++;
                        }
                        index ++;
                    }
                    res.render('stats', { title: 'COVID Stats',user: req.user, data: data, label: prov, graphTitle: 'Current Active Cases', chart: 'bar', prov:'BC',stats:'none', topUser: topUser});
                }
            })
          })
}

exports.postStats = (req,res) => {
    var prov;
    switch(req.body.province)
    {
        case 'Alberta':
        prov= 'AB'
        break;

        case 'Manitoba':
        prov= 'MB'
        break;

        case 'NL':
        prov= 'NL'
        break;

        case 'Nova Scotia':
        prov= 'NS'
        break;

        case 'Nunavut':
        prov= 'NU'
        break;

        case 'PEI':
        prov= 'PE'
        break;

        case 'Quebec':
        prov= 'QC'
        break;

        case 'Saskatchewan':
        prov= 'SK'
        break;

        case 'Yukon':
        prov= 'YT'
        break;

        case 'Repatriated':
        prov= 'RP'
        break;

        default:
        prov = 'BC'

    }

    var stats = (req.body.stats == 'available vaccine') ? 'avaccine': req.body.stats
  
    var options = {
    'method': 'GET',
    'url': `https://api.opencovid.ca/timeseries?loc=${prov}&stat=${stats}`,
    'headers': {
    }
    };
    request(options, function (error, results) {
        if (error) throw new Error(error);

        const obj = JSON.parse(results.body);

        Center.find({},function(err,results)
            {
                if(err)
                {
                    console.log(err)
                    return res.status(500).json({error: 'find error'})
                }else
                {
                    results.sort((a,b)=> b.likes.length - a.likes.length)
                    var topUser = []
                    var len = (results.length <3)? results.length :3
                    var index =0;
                    var added =0;
                    while(index<results.length && added <len )
                    {
                        if(!topUser.includes(results[index].user))
                        {
                            topUser.push(results[index].user)
                            added++;
                        }
                        index ++;
                    }
                    
                    req.topUser = topUser

                    switch(stats){
                        case 'cases':
                            casesConfig.getCases(req,res,obj)
                            break;
                        case 'mortality':
                            casesConfig.getMortality(req,res,obj)
                            break;
                        case 'recovered':
                            casesConfig.getRecovered(req,res,obj)
                            break;
                        case 'testing':
                            casesConfig.getTesting(req,res,obj)
                            break;
                        default:
                            casesConfig.getVaccine(req,res,obj)
                    }
                    
                }
            })
    })
}