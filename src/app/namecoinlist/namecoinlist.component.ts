import { Component, OnInit, OnDestroy  } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { GlobalService } from '../service/global.service';
import {TranslateService} from '@ngx-translate/core';


declare var $:any;
declare var swal:any;

declare interface NamecoinTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'namecoinlist-cmp',
  templateUrl: './namecoinlist.component.html'
})


export class NamecoinlistComponent implements OnInit {



     public nameAddressTableData;
	 public nameAddressTableDataDisplay;
	 private sResult:string = "";
	 private walletChangeSubscription: ISubscription;
	 private timeChangeSubscription: ISubscription;
     private updateGuard:boolean = false; 
	 
	 
	constructor(private translate: TranslateService,private globalService:GlobalService) 
	{

	  
		
	}
	

	async fillNames()
	{
		let _that = this;
		
		/* Needs this to prevent table filling 2 times due tu simultanious change event updates, seems like angular bug(?)*/
		if(this.updateGuard)
		{
			return;
		}
		
		this.nameAddressTableData = [];
		this.nameAddressTableDataDisplay = [];
		this.updateGuard = true;
		
		setTimeout(function() 
		{
					
			_that.updateGuard = false;
			
		}, 1000);	
		
		
		
        let addressArray = await this.globalService.getNameList();
		
		for(let d = 0; d < addressArray.length;d++)
		{
		
            let valuenn = addressArray[d][1];
			let sCopy = valuenn;
			for(let s  =0; s < valuenn.length; s += 50)
			{
				let tempStr = valuenn.substr(s * 50, 50);
				
				if(tempStr.indexOf(' ') < 0)
				{
                     let position = (s+1 * 50);
					 
					 if(position < sCopy.length)
					 {
						 sCopy = [sCopy.slice(0, position), " +\n\r", sCopy.slice(position)].join('');
					 }    					
				}
			}
			
			valuenn = sCopy;
			
			let newEntry = {"name": addressArray[d][0], "value" : valuenn, address: addressArray[d][2]};
		    this.nameAddressTableData.push(newEntry);		
			
            valuenn = newEntry["name"];
			sCopy = valuenn;
			for(let s  =0; s < valuenn.length; s += 50)
			{
				let tempStr = valuenn.substr(s * 50, 50);
				
				if(tempStr.indexOf(' ') < 0)
				{
                     let position = (s+1 * 50);
					 
					 if(position < sCopy.length)
					 {
						 sCopy = [sCopy.slice(0, position), " +\n\r", sCopy.slice(position)].join('');
					 }    					
				}
			}
			
			newEntry["name"] = sCopy;			
			
	        this.nameAddressTableDataDisplay.push(newEntry);
		}		
		
	
	}
	
	
    async SaveSCVToFile(filePath)
	{
        let addressArray = await this.globalService.getNameList();
		
        let input = [];
		let dArraS = ["name", "value","address"];
		input.push(dArraS);		
		
		for(let d = 0; d < addressArray.length;d++)
		{
		
            let valuenn = addressArray[d][1];
			let sCopy = valuenn;
			for(let s  =0; s < valuenn.length; s += 50)
			{
				let tempStr = valuenn.substr(s * 50, 50);
				
				if(tempStr.indexOf(' ') < 0)
				{
                     let position = (s+1 * 50);
					 
					 if(position < sCopy.length)
					 {
						 sCopy = [sCopy.slice(0, position), " +", sCopy.slice(position)].join('');
					 }    					
				}
			}
			
			valuenn = sCopy;
			
			let newEntry = [addressArray[d][0], valuenn, addressArray[d][2]];
		    input.push(newEntry);							
	
		}	
			
			
			
		let _that = this;
		const stringify = window.require('csv-stringify')
		stringify(input, function(err, output)
		{
			
			const fs = window.require('fs');
			fs.writeFileSync(filePath,output);
			swal(_that.translate.instant('STRANSACTIONS.EDONE'), _that.translate.instant('STRANSACTIONS.EDONE'), "success");
			
		});

		
	}
	
	async exportCSV()
	{
		let filePath;
		let _that = this;
		window.require('electron').remote.dialog.showSaveDialog({title: this.translate.instant('SSETTINGS.SELBUDIST'), defaultPath: '~/transactions.csv',  filters: [{name: 'Transactions Data', extensions: ['csv']}]}, (filePath) => 
		{
			if (filePath === undefined)
			{
				swal(this.translate.instant('SOVERVIEW.ERROR'), this.translate.instant('SSETTINGS.NOFILESEL'), "error");
				return;
			}	

      
		
		    _that.SaveSCVToFile(filePath);
		

		
		});	
		
		
	}	
	
	async transferNameBox(name)
	{

	    let _that = this;
		swal({
		  title: 'Transfer Name',
		  html: '<input id="swal-input1" class="swal2-input" placeholder = "'+this.translate.instant('SCHIMAERA.DESTADDR')+'">',
		  focusConfirm: false,
		  showCancelButton: true,
		  preConfirm: function () {
			return new Promise(function (resolve) {
			  resolve([
				$('#swal-input1').val()
			  ])
			})
		  }
		}).then(function (result) 
		{
		  if(result.value[0] == "")
		  {
			  swal("Response", this.translate.instant('SCHIMAERA.NOVALUES'));  
			  return;
		  }
		  
		  return _that.globalService.updateName(name, "", result.value[0]); 
		  
		  
		}).catch(swal.noop)		
		
		
	}	
	
	async updateNameBox(name)
	{

	    let _that = this;
		swal({
		  title: 'Update Name',
		  html: '<input id="swal-input1" class="swal2-input" placeholder = "'+this.translate.instant('SCHIMAERA.ENTERVAL')+'">',
		  focusConfirm: false,
		  showCancelButton: true,
		  preConfirm: function () {
			return new Promise(function (resolve) {
			  resolve([
				$('#swal-input1').val()
			  ])
			})
		  }
		}).then(function (result) 
		{
		  if(result.value[0] == "")
		  {
			  swal(this.translate.instant('SCHIMAERA.RESPONSE'), this.translate.instant('SCHIMAERA.NOVALUES'));  
			  return;
		  }
		  
		  return _that.globalService.updateName(name, result.value[0], ""); 
		  
		  
		}).catch(swal.noop)		
		
		
	}
	
    ngOnInit()
	{ 
	
        this.nameAddressTableData = [];
		this.nameAddressTableDataDisplay = [];
		
		 this.walletChangeSubscription = this.globalService.walletChanged$.subscribe
		 (
			value => 
			{
	          this.fillNames();
		 });
	   		
         this.timeChangeSubscription = this.globalService.tMedianTimeChanged$.subscribe
	     (
		     value => 
			 {
		
				  this.fillNames();
			
	     });	   		

    }
	
	
    ngOnDestroy()
	{
	 this.walletChangeSubscription.unsubscribe();
	 this.timeChangeSubscription.unsubscribe();
	}		
	
}
