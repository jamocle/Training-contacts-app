import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { addressTypeValues, phoneTypeValues } from '../contacts/contact.model';
import { restrictedWordsValidator as restrictedWords } from '../Validators/restricted-words.validator';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;

  contactForm = this.fb.nonNullable.group({
    id: '',
    personal: false,
    firstName: ['',[Validators.required, Validators.minLength(3)]],
    lastName: '',
    dateOfBirth: <Date | null>null,
    favoritesRanking: <number | null>null,
    phone: this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
    }),
    address: this.fb.nonNullable.group({
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      addressType: '',
    }),
    notes:['', restrictedWords(['foo', 'bar'])],
  });
  
  constructor(private route: ActivatedRoute, 
    private contactService: ContactsService,
    private router: Router,
    private fb: FormBuilder) { }

  get vm() {
    return this.contactForm.controls;
  }

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return

    this.contactService.getContact(contactId).subscribe(
      {
        next: contact=>{
          if (!contact) return;
          // const names = {firstName: contact.firstName, lastName:contact.lastName};
          // this.contactForm.patchValue(names);
          this.contactForm.patchValue(contact);
        }
      })
  }

  saveContact() {
    console.log(this.contactForm.value);
    this.contactService.saveContact(this.contactForm.getRawValue()).subscribe({
      next: (data)=>
      {
        this.router.navigate(["/contacts"]);
      }
    });

    // console.log(this.vm.firstName.value);
    // console.log(this.vm.lastName.value);
    // console.log(this.vm.dateOfBirth.value);
    // console.log(this.vm.favoritesRanking.value);
  }
}
