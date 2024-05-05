import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { DoctorModel } from '../../models/doctor.model';
import { CommonModule } from '@angular/common';
import { departments } from '../../constants';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { SwalService } from '../../services/swal.service';
import { DoctorPipe } from '../../pipe/doctor.pipe';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,FormValidateDirective,DoctorPipe],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
})
export class DoctorsComponent implements OnInit {
  doctors: DoctorModel[] = [];
  departments=departments
  createModel:DoctorModel=new DoctorModel();
  updateModel: DoctorModel= new DoctorModel();

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
    this.http.post<DoctorModel[]>("Doctors/GetAll", {}, (res) => {
      this.doctors = res.data;
    });
  }

  add(form:NgForm){
    if(form.valid){
      this.http.post<string>("Doctors/Create",this.createModel,(res)=>{
        
        this.swal.callToast(res.data,"success");
        this.getAll();
        this.addModalCloseButton?.nativeElement.click();
        this.createModel= new DoctorModel();
      });
    }
  }

  delete(id:string,fullName:string){
    this.swal.calSwal("Doktoru Sil", `${fullName} adlı doktoru silmek istediğinize emin misiniz?`,()=>{
      this.http.post<string>("Doctors/DeleteById",{id:id},(res)=>{
        this.swal.callToast(res.data,"info");
        this.getAll();
      })
    });
  }

  get(data:DoctorModel){
    this.updateModel={...data};
    this.updateModel.departmentValue=data.department.value;
  }


  update(form:NgForm){
    if(form.valid){
      this.http.post<string>("Doctors/Update",this.updateModel,(res)=>{
        
        this.swal.callToast(res.data,"success");
        this.getAll();
        this.updateModalCloseButton?.nativeElement.click();
      
      });
    }
  }
}
