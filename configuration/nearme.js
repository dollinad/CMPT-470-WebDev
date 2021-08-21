const Center = require ('../models/center')
const geocoder = require('../Utils/geocoder')

// converts the centers json into only list of resources
function makeResourcesArr(results, userloc, typeFilter) {
    //console.log(results[0].resource[0])
    //console.log(results[0])
    Arr = []
    for (var i = 0; i < results.length; i++) {
        center_name = results[i].site;
        center_id = results[i]._id;
        console.log('LENGTH: ', results[i].resource.length);
        for (var j = 0; j < results[i].resource.length; j++) {
            r = new Object
            // corresponding center
            r.center_name = center_name;
            r.center_id = center_id;

            // distance away
            lon2 = results[i].location.coordinates[0]
            lat2 = results[i].location.coordinates[1]
            lon1 = userloc[0].longitude
            lat1 = userloc[0].latitude
            //console.log(lon2, lon1, lat2, lat1)
            const R = 6371e3; // metres
            const φ1 = lat1 * Math.PI/180; // φ, λ in radians
            const φ2 = lat2 * Math.PI/180;
            const Δφ = (lat2-lat1) * Math.PI/180;
            const Δλ = (lon2-lon1) * Math.PI/180;
            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const d = R * c; // in metres

            r.dist_away = (d/1000).toFixed(1) // to KM
            // resource
            r.type = results[i].resource[j].type
            r.name = results[i].resource[j].name
            r.qty = results[i].resource[j].qty
            r.likes = results[i].likes.length

            if (typeFilter == "all") {
                Arr.push(r)
            } else if (typeFilter == results[i].resource[j].type) {
                Arr.push(r)
            }

        }
    }
    // sort based on distance away
    resourceArr = Arr.sort(function(a, b) {
        return a.dist_away - b.dist_away;
    });
}

var listAllNearMe = async(val, req, res) => {
    // todo: why isnt this shit isnt working
    userAddr = req.cookies['userAddr'];
    if (typeof userAddr !== 'undefined') {
        // const loc = await geocoder.geocode(userAddr);
        var addr = await geocoder.geocode(userAddr);
    }
    await Center.find({},function(err,results)
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({error: 'find error'})
        } else
        {
            if (typeof addr !== 'undefined') {
                //console.log(results)
                makeResourcesArr(results, addr, 'all')
            }
            else {
                resourceArr = [];
                userAddr = "";
            }
            var title;
            if(val === "nearme") {
                title = "Please set address";
            } else {
                title = "Fight Against COVID";
            }
            var data = {title : title, Resource : resourceArr, userAddr : userAddr, user: req.user};
            console.log(resourceArr)
            res.render(val, data);
        }
    })
}

var changeAddress = async(req,res) => {
    // todo user address tied with account?
    const loc = await geocoder.geocode(req.body.address);
    await Center.find({},function(err,results)
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({error: 'find error'})
        } else
        {
            res.cookie('userAddr', req.body.address, { httpOnly: true });
            makeResourcesArr(results, loc, 'all')
            var data = {title : "All resources", Resource : resourceArr, user: req.user, userAddr: req.body.address}
            res.render('nearme', data)
        }
    })
}

var listTestingNearMe = async(req,res) => {
    userAddr = req.cookies['userAddr'];
    const loc = await geocoder.geocode(userAddr);
    await Center.find({},function(err,results)
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({error: 'find error'})
        } else
        {
            makeResourcesArr(results, loc, 'oxygen')
            var data = {title : "COVID-19 Tests", Resource : resourceArr, user: req.user, address: userAddr}
            res.render('nearme', data)        
        }
    })
}

var listVaccineNearMe = async(req,res) => {
    userAddr = req.cookies['userAddr'];
    const loc = await geocoder.geocode(userAddr);
    await Center.find({}, function(err,results)
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({error: 'find error'})
        } else
        {
            makeResourcesArr(results, loc, 'vaccine')
            var data = {title : "COVID-19 Vaccines", Resource : resourceArr, user: req.user, address: userAddr}
            res.render('nearme', data)        
        }
    })
}

var listHospitalNearMe = async(req,res) => {
    userAddr = req.cookies['userAddr'];
    const loc = await geocoder.geocode(userAddr);
    await Center.find({},function(err,results)
    {
        if(err)
        {
            console.log(err)
            return res.status(500).json({error: 'find error'})
        } else
        {
            makeResourcesArr(results, loc, 'bed')
            var data = {title : "Hospital Resources", Resource : resourceArr, user: req.user, address: userAddr}
            res.render('nearme', data)        
        }
    })
}

module.exports.listAllNearMe = listAllNearMe
module.exports.changeAddress = changeAddress
module.exports.listTestingNearMe = listTestingNearMe
module.exports.listVaccineNearMe = listVaccineNearMe
module.exports.listHospitalNearMe = listHospitalNearMe
