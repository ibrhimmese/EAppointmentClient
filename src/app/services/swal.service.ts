import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  callToast(title:string, icon:SweetAlertIcon="success"){
    Swal.fire({
      title:title,
      timer:3000,
      icon:icon,
      position:"bottom-right",
      showCancelButton:false,
      showCloseButton:false,
      showConfirmButton:false,
      toast:true
    });
  }

  calSwal(title:string,text:string, callBack:()=>void){
    Swal.fire({
      title:title,
      icon:"question",
      text:text,
      showConfirmButton:true,
      confirmButtonText:"Sil",
      showCancelButton:true,
      cancelButtonText:"İptal"
    }).then(res=>{
      if(res.isConfirmed){
       callBack();
      }
    });
  }
}

export type SweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question'

