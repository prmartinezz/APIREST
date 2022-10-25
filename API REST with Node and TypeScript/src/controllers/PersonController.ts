import { Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';
import { Person } from '../entities/Person';
import { personRepository } from '../repositories/PersonRepository';
import * as yup from 'yup';

class PersonController {

    async validate(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'POST' || req.method === 'PUT') {
            try {
                const schema = yup.object().shape({
                    firstName: yup.string().required(),
                    lastName: yup.string().required(),
                    phone: yup.string().required(),
                    email: yup.string().email().required(),
                    cpf: yup.string().required()
                });
    
                await schema.validate(req.body, { abortEarly: false });
            }
            catch (err) {
                return res.status(422).json({
                    message: 'Invalid data!',
                    error: err
                });
            }
        }

        next();
    }

    async getAll(req: Request, res: Response) {
        const persons = await personRepository.find();

        if (!persons) {
            return res.status(404).json({
                message: 'Persons not found!'
            });
        }

        return res.status(200).json(persons);
    }

    async getById(req: Request, res: Response) {
        const id = ObjectID.createFromHexString(req.params.id);
        const person = await personRepository.findOneBy(id);

        if (!person) {
            return res.status(404).json({
                message: 'Person not found!'
            });
        }

        return res.status(200).json(person);
    }

    async create(req: Request, res: Response) {
        const { firstName, lastName, phone, email, cpf } = req.body;

        let person = new Person(firstName, lastName, phone, email, cpf);
        person = await personRepository.save(person);

        return res.status(201).json({
            message: 'Person successfully created!',
            person
        });
    }

    async update(req: Request, res: Response) {
        const { firstName, lastName, phone, email, cpf } = req.body;

        const id = ObjectID.createFromHexString(req.params.id);
        let person = await personRepository.findOneBy(id);

        if (!person) {
            return res.status(404).json({
                message: 'Person not found!'
            });
        }

        person.setProperties(firstName, lastName, phone, email, cpf);
        person = await personRepository.save(person);

        return res.status(200).json({
            message: 'Person successfully updated!',
            person
        });
    }

    async delete(req: Request, res: Response) {
        const id = ObjectID.createFromHexString(req.params.id);
        const person = await personRepository.findOneBy(id);

        if (!person) {
            return res.status(404).json({
                message: 'Person not found!'
            });
        }

        await personRepository.delete(person);
        return res.status(200).json({
            message: 'Person successfully deleted!'
        });
    }
}

export { PersonController };
