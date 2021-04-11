import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { DeliveryManComponentsPage, DeliveryManDeleteDialog, DeliveryManUpdatePage } from './delivery-man.page-object';

const expect = chai.expect;

describe('DeliveryMan e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let deliveryManComponentsPage: DeliveryManComponentsPage;
  let deliveryManUpdatePage: DeliveryManUpdatePage;
  let deliveryManDeleteDialog: DeliveryManDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load DeliveryMen', async () => {
    await navBarPage.goToEntity('delivery-man');
    deliveryManComponentsPage = new DeliveryManComponentsPage();
    await browser.wait(ec.visibilityOf(deliveryManComponentsPage.title), 5000);
    expect(await deliveryManComponentsPage.getTitle()).to.eq('coopCycleApp.deliveryMan.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(deliveryManComponentsPage.entities), ec.visibilityOf(deliveryManComponentsPage.noResult)),
      1000
    );
  });

  it('should load create DeliveryMan page', async () => {
    await deliveryManComponentsPage.clickOnCreateButton();
    deliveryManUpdatePage = new DeliveryManUpdatePage();
    expect(await deliveryManUpdatePage.getPageTitle()).to.eq('coopCycleApp.deliveryMan.home.createOrEditLabel');
    await deliveryManUpdatePage.cancel();
  });

  it('should create and save DeliveryMen', async () => {
    const nbButtonsBeforeCreate = await deliveryManComponentsPage.countDeleteButtons();

    await deliveryManComponentsPage.clickOnCreateButton();

    await promise.all([deliveryManUpdatePage.setPhoneInput('1'), deliveryManUpdatePage.setNameInput('htt')]);

    expect(await deliveryManUpdatePage.getPhoneInput()).to.eq('1', 'Expected Phone value to be equals to 1');
    expect(await deliveryManUpdatePage.getNameInput()).to.eq('htt', 'Expected Name value to be equals to htt');

    await deliveryManUpdatePage.save();
    expect(await deliveryManUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await deliveryManComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last DeliveryMan', async () => {
    const nbButtonsBeforeDelete = await deliveryManComponentsPage.countDeleteButtons();
    await deliveryManComponentsPage.clickOnLastDeleteButton();

    deliveryManDeleteDialog = new DeliveryManDeleteDialog();
    expect(await deliveryManDeleteDialog.getDialogTitle()).to.eq('coopCycleApp.deliveryMan.delete.question');
    await deliveryManDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(deliveryManComponentsPage.title), 5000);

    expect(await deliveryManComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
