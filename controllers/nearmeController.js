const nearmeConfig = require("../configuration/nearme")

exports.show_NearMe = async (req,res) => {
    console.log(`user is ${req.user}`)
    nearmeConfig.listAllNearMe("nearme",req,res)
}

exports.show_Testing_NearMe = async (req,res) => {
    nearmeConfig.listTestingNearMe(req,res)
}

exports.show_Vaccine_NearMe = async (req,res) => {
    nearmeConfig.listVaccineNearMe(req,res)
}

exports.show_Hospital_NearMe = async (req,res) => {
    nearmeConfig.listHospitalNearMe(req,res)
}

exports.change_Address = async (req,res) => {
    nearmeConfig.changeAddress(req,res)
}