import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ActivityService } from './activity.service';
import { CreateActivityDto, EditActivityDto } from './dto';

@UseGuards(JwtGuard)
@Controller('activities')
export class ActivityController {
    constructor(private activityService: ActivityService) { }

    @Get()
    getActivities(@GetUser('id') userId: number) {
        return this.activityService.getActivities(userId);
    }

    @Get(':id')
    getActivityById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) activityId: number) {
        return this.activityService.getActivityById(userId, activityId);
    }

    @Post()
    createActivity(@GetUser('id') userId: number, @Body() dto: CreateActivityDto) {
        return this.activityService.createActivity(userId, dto);
    }

    @Patch(':id')
    editActivityById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) activityId: number, @Body() dto: EditActivityDto) {
        return this.activityService.editActivityById(userId, activityId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteActivityById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) activityId: number) {
        return this.activityService.deleteActivityById(userId, activityId);
    }
}
