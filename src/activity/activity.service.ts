import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto, EditActivityDto } from './dto';

@Injectable()
export class ActivityService {
    constructor(private prisma: PrismaService) { }
    getActivities(userId: number) {
        return this.prisma.activity.findMany({
            where: {
                userId
            }
        });
    }

    getActivityById(userId: number, activityId: number) {
        return this.prisma.activity.findFirst({
            where: {
               id:activityId,
               userId
            }
        });
    }
    async createActivity(userId: number, dto: CreateActivityDto) {
        const activity = await this.prisma.activity.create({
            data: {
                userId,
                ...dto
            }
        });
        return activity;
    }

    async editActivityById(userId: number, activityId: number, dto: EditActivityDto) {
        const activity = await this.prisma.activity.findUnique({
            where:{
                id: activityId
            }
        });

        if(!activity || activity.userId!==userId){
            throw new ForbiddenException('Access to resource denied');
        }
    
        return this.prisma.activity.update({
            where:{
              id: activityId  
            },
            data:{
                ...dto
            }
        });
     }

    async deleteActivityById(userId: number, activityId: number) { 
        const activity= await this.prisma.activity.findUnique({
            where:{
                id: activityId
            }
        });
       
        if(!activity || activity.userId!==userId){
            throw new ForbiddenException('Access to resource denied');
        }

        await this.prisma.activity.delete({
            where:{
                id: activityId
            }
        })
    }
}
