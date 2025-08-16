import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Trainer from "../model/trainer.js";
import loggingController from "./loggingController.js";

dotenv.config();

export async  function registerTrainer(req,res){
    if(req.user == null){
        res.status(403).json({
            message: "Please login as admin to create a new user"
        });
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to create a new trainer account "
        });
        return;
    }
    const trainer = new Trainer(req.body);
    try{
        await trainer.save();
        res.status(201).json({
            message: "Trainer registered successfully",
        });
    }catch(err){
        res.status(500).json({
            message: "Error registering trainer",
            error: err.message
        });
    }

}
export function getAllTrainers(req,res){
    Trainer.find().then(
        (trainers) => {
            res.json(trainers);
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error retrieving trainers",
                error: err.message
            });
        }
    );
}
export function loginTrainer(req, res) {
    req.body.role = 'trainer';  
    return loggingController(req, res);
}
export function updateTrainer(req, res) {
    if(req.user == null){
        res.status(403).json({
            message: "Please login as admin to update a trainer"
        });
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to update a trainer"
        });

    Trainer.findOneAndUpdate({ 
        trainerIdt: req.params.id },
        req.body).then(
        (trainer) => {
            if (!trainer) {
                return res.status(404).json({ 
                    message: 'Trainer not found' });
            }else{
                res.status(200).json({
                    message: "Trainer updated successfully",
                    trainer: trainer
                });
            }  
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error updating trainer",
                error: err.message
            });
        }
    );
}
}
export function deleteTrainer(req, res) {
    if(req.user == null){
        res.status(403).json({
            message: "Please login as admin to delete a trainer"
        });
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to delete a trainer"
        });
        return;
    }
    Trainer.findOneAndDelete({ trainerId: req.params.id }).then(
        (trainer) => {
            if (!trainer) {
                return res.status(404).json({ 
                    message: 'Trainer not found' });
            }
            res.status(200).json({
                message: "Trainer deleted successfully"
            });
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error deleting trainer",
                error: err.message
            });
        }
    );
}
export function getTrainerById(req,res){
    Trainer.findOne({ trainerId: req.params.id }).then(
        (trainer) => {
            if (!trainer) {
                return res.status(404).json({ 
                    message: 'Trainer not found' });
            }
            res.status(200).json({
                trainer: trainer
            });
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error retrieving trainer",
                error: err.message
            });
        }
    );
}

