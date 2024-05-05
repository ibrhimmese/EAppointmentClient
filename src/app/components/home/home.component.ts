import { FormsModule, NgForm } from '@angular/forms';
import { DoctorModel } from '../../models/doctor.model';
import { departments } from './../../constants';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DxSchedulerModule } from 'devextreme-angular';
import { HttpService } from '../../services/http.service';
import { AppointmentModel } from '../../models/appointment.model';
import { CreateAppointmentModel } from '../../models/create-appointment.model';
import { FormValidateDirective } from 'form-validate-angular';
import { identifierName } from '@angular/compiler';
import { PatientModel } from '../../models/patient.model';
import { SwalService } from '../../services/swal.service';

declare const $:any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,CommonModule,DxSchedulerModule,FormValidateDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers:[DatePipe]
})
export class HomeComponent {
  departments=departments;
  doctors:DoctorModel[]=[];

  @ViewChild("#addModalCloseButton") addModalCloseButton:ElementRef<HTMLButtonElement> | undefined;

  selectedDepartmentValue:number=0;
  selectedDoctorId:string="";

  appointments:AppointmentModel[]=[];

  createModel:CreateAppointmentModel=new CreateAppointmentModel();


  constructor(
    private http:HttpService,
    private date:DatePipe,
    private swal:SwalService
  ){}

  getAllDoctor(){
    this.selectedDoctorId="";
    if(this.selectedDepartmentValue>0){
      this.http.post<DoctorModel[]>("Appointments/GetAllDoctorByDepartment",{departmentValue: +this.selectedDepartmentValue},(res)=>{
        this.doctors=res.data;
      });
    }
  }

  getAllAppointments(){
    if(this.selectedDoctorId){
      this.http.post<AppointmentModel[]>("Appointments/GetAllById",{doctorId: this.selectedDoctorId},(res)=>{
        this.appointments=res.data;
      });
    }
  }


  onAppointmentFormOpening(e:any){
    e.cancel=true;
    this.createModel.startDate = this.date.transform(e.appointmentData.startDate,"dd.MM.yyyy HH:mm") ?? "";
    this.createModel.endDate=this.date.transform(e.appointmentData.endDate,"dd.MM.yyyy HH:mm") ?? "";
    this.createModel.doctorId=this.selectedDoctorId;

    $("#addModal").modal("show");
  }



  getPatient(){
    this.http.post<PatientModel>("Appointments/GetPatientByIdentityNumber",{identityNumber:this.createModel.identityNumber}, res=>{
      if(res.data===null){
        this.createModel.firstName="";
        this.createModel.lastName="";
        this.createModel.city="";
        this.createModel.town="";
        this.createModel.fullAddress="";
        this.createModel.patientId=null;
        return;
      }
      this.createModel.patientId=res.data.id;
      this.createModel.firstName=res.data.firstName;
      this.createModel.lastName=res.data.lastName;
      this.createModel.city=res.data.city;
      this.createModel.town=res.data.town;
      this.createModel.fullAddress=res.data.fullAddress;
    })
  }

  create(form:NgForm){
    if(form.valid){
      this.http.post("Appointments/Create",this.createModel,res=>{
        this.swal.callToast(res.data);
        this.addModalCloseButton?.nativeElement.click();
        this.createModel= new CreateAppointmentModel();
        this.getAllAppointments();
      });
    }
  }

// silmeden önce
  onAppointmentDeleted(e:any){
    e.cancel=true;

    
  }


  //Silmeden sonra
  onAppointmentDeleting(e:any){
    e.cancel=true;
    
    this.swal.calSwal("Silmek İstediğinize emin misiniz",`${e.appointmentData.patient.fullName} adlı randevuyu silmek mi istiyorsunuz?`,()=>{
    this.http.post<string>("Appointments/DeleteById",{id:e.appointmentData.id},res=>{
      this.swal.callToast(res.data,"info");
      this.getAllAppointments();
    });
    });
  }


  onAppointmentUpdating(e:any){
    e.cancel=true;
    
    const data = {
      id:e.oldData.id,
      startDate:this.date.transform(e.newData.startDate,"dd.MM.yyyy HH:mm"),
      endDate:this.date.transform(e.newData.endDate,"dd.MM.yyyy HH:mm"),
    };
    this.http.post<string>( "Appointments/Update" ,data,res=>{
      this.swal.callToast(res.data,"success");
      this.getAllAppointments();
    })
  }
}
