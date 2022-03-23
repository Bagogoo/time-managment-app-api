import { Type } from "class-transformer"
import { IsDate, IsOptional, IsString } from "class-validator"

export class EditActivityDto {
    @IsDate()
    @IsOptional()
    @Type(()=>Date)
    startTime?: Date

    @IsDate()
    @IsOptional()
    @Type(()=>Date)
    endTime?: Date
    
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    description?: string
}