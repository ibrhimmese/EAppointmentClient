import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PatientModel } from '../../models/patient.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidateDirective } from 'form-validate-angular';
import { PatientPipe } from '../../pipe/patient.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule,FormsModule,FormValidateDirective,PatientPipe,RouterLink],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit{
  patients: PatientModel[] = [];
  
  createModel:PatientModel=new PatientModel();
  updateModel: PatientModel= new PatientModel();

  search:string="";


  @ViewChild("addModalCloseButton") addModalCloseButton:ElementRef<HTMLButtonElement> | undefined;
  @ViewChild("updateModalCloseButton") updateModalCloseButton:ElementRef<HTMLButtonElement> | undefined;

  constructor(
    private http: HttpService,
    private swal:SwalService
  ) 
    
    {}

  ngOnInit(): void {
    this.getAll();
    // this.swal.calSwal("Başlık","yazı",()=>{
    //   alert("Silme işlemi Başarılı");
    // });
  }

  getAll() {
    this.http.post<PatientModel[]>("Patients/GetAll", {}, (res) => {
      this.patients = res.data;
    });
  }

  add(form:NgForm){
    if(form.valid){
      this.http.post<string>("Patients/Create",this.createModel,(res)=>{
        
        this.swal.callToast(res.data,"success");
        this.getAll();
        this.addModalCloseButton?.nativeElement.click();
        this.createModel= new PatientModel();
      });
    }
  }

  delete(id:string,fullName:string){
    this.swal.calSwal("Hastayı Sil", `${fullName} adlı hastayı silmek istediğinize emin misiniz?`,()=>{
      this.http.post<string>("Patients/DeleteById",{id:id},(res)=>{
        this.swal.callToast(res.data,"info");
        this.getAll();
      })
    });
  }

  get(data:PatientModel){
    this.updateModel={...data};
  
  }


  update(form:NgForm){
    if(form.valid){
      this.http.post<string>("Patients/Update",this.updateModel,(res)=>{
        
        this.swal.callToast(res.data,"success");
        this.getAll();
        this.updateModalCloseButton?.nativeElement.click();
      
      });
    }
  }
}
