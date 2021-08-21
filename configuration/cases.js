var getCases = (req,res,obj) =>{
    var timestamp = []
    var data = []
        
    obj[Object.keys(obj)[0]].forEach(element => {
        timestamp.push(element.date_report)
        data.push(element.cases)
    });
    res.locals.title = "Fight Against COVID";
    var len = obj[Object.keys(obj)[0]].length - 1;
    var key = {cumulative: obj[Object.keys(obj)[0]][len].cumulative_cases }
    res.render('stats', { title: 'Fight Against COVID',user: req.user, data: data, label: timestamp, graphTitle: 'Daily # of Active Cases', chart: 'line', prov:req.body.province,stats:req.body.stats,topUser: req.topUser, key: key});
}

var getMortality = (req,res,obj) =>{
    var timestamp = []
    var data = []
        
    obj[Object.keys(obj)[0]].forEach(element => {
        timestamp.push(element.date_death_report)
        data.push(element.deaths)
    });
    res.locals.title = "Fight Against COVID";
    var len = obj[Object.keys(obj)[0]].length - 1;
    var key = {cumulative: obj[Object.keys(obj)[0]][len].cumulative_deaths }
    res.render('stats', { title: 'Fight Against COVID',user: req.user, data: data, label: timestamp, graphTitle: 'Daily # of Mortality', chart: 'line',prov:req.body.province,stats:req.body.stats,topUser: req.topUser, key: key});
}

var getRecovered = (req,res,obj) =>{
    var timestamp = []
    var data = []
        
    obj[Object.keys(obj)[0]].forEach(element => {
        timestamp.push(element.date_recovered)
        data.push(element.recovered)
    });
    res.locals.title = "Fight Against COVID";
    var len = obj[Object.keys(obj)[0]].length - 1;
    var key = {cumulative: obj[Object.keys(obj)[0]][len].cumulative_recovered }
    res.render('stats', { title: 'Fight Against COVID',user: req.user, data: data, label: timestamp, graphTitle: 'Daily # of Recovered', chart: 'line',prov:req.body.province,stats:req.body.stats,topUser: req.topUser, key: key});
}

var getTesting = (req,res,obj) =>{
    var timestamp = []
    var data = []
        
    obj[Object.keys(obj)[0]].forEach(element => {
        timestamp.push(element.date_testing)
        data.push(element.testing)
    });
    res.locals.title = "Fight Against COVID";
    var len = obj[Object.keys(obj)[0]].length - 1;
    var key = {cumulative: obj[Object.keys(obj)[0]][len].cumulative_testing }
    res.render('stats', { title: 'Fight Against COVID',user: req.user, data: data, label: timestamp, graphTitle: 'Daily # of Testing', chart: 'line',prov:req.body.province,stats:req.body.stats,topUser: req.topUser, key: key});
}

var getVaccine = (req,res,obj) =>{
    var timestamp = []
    var data = []
        
    obj[Object.keys(obj)[0]].forEach(element => {
        timestamp.push(element.date_vaccine_administered)
        data.push(element.avaccine)
    });
    res.locals.title = "Fight Against COVID";
    var len = obj[Object.keys(obj)[0]].length - 1;
    var key = {cumulative: obj[Object.keys(obj)[0]][len].cumulative_avaccine }
    res.render('stats', { title: 'Fight Against COVID',user: req.user, data: data, label: timestamp, graphTitle: 'Available # of Vaccines', chart: 'line',prov:req.body.province,stats:req.body.stats,topUser: req.topUser, key: key});
}

module.exports.getCases= getCases
module.exports.getMortality= getMortality
module.exports.getRecovered= getRecovered
module.exports.getTesting= getTesting
module.exports.getVaccine=getVaccine