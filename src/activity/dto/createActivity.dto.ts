import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateActivityDto {
    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    startTime: Date

    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    endTime: Date
    
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    description?: string
}