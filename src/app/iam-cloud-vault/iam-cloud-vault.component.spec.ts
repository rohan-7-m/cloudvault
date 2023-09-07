import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IamCloudVaultComponent } from './iam-cloud-vault.component';

describe('IamCloudVaultComponent', () => {
  let component: IamCloudVaultComponent;
  let fixture: ComponentFixture<IamCloudVaultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IamCloudVaultComponent]
    });
    fixture = TestBed.createComponent(IamCloudVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
