import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RestaurantComponentsPage, RestaurantDeleteDialog, RestaurantUpdatePage } from './restaurant.page-object';

const expect = chai.expect;

describe('Restaurant e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let restaurantComponentsPage: RestaurantComponentsPage;
  let restaurantUpdatePage: RestaurantUpdatePage;
  let restaurantDeleteDialog: RestaurantDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Restaurants', async () => {
    await navBarPage.goToEntity('restaurant');
    restaurantComponentsPage = new RestaurantComponentsPage();
    await browser.wait(ec.visibilityOf(restaurantComponentsPage.title), 5000);
    expect(await restaurantComponentsPage.getTitle()).to.eq('coopCycleApp.restaurant.home.title');
    await browser.wait(ec.or(ec.visibilityOf(restaurantComponentsPage.entities), ec.visibilityOf(restaurantComponentsPage.noResult)), 1000);
  });

  it('should load create Restaurant page', async () => {
    await restaurantComponentsPage.clickOnCreateButton();
    restaurantUpdatePage = new RestaurantUpdatePage();
    expect(await restaurantUpdatePage.getPageTitle()).to.eq('coopCycleApp.restaurant.home.createOrEditLabel');
    await restaurantUpdatePage.cancel();
  });

  it('should create and save Restaurants', async () => {
    const nbButtonsBeforeCreate = await restaurantComponentsPage.countDeleteButtons();

    await restaurantComponentsPage.clickOnCreateButton();

    await promise.all([
      restaurantUpdatePage.setRestaurantIdInput('5'),
      restaurantUpdatePage.setTitleInput('title'),
      restaurantUpdatePage.setLocationInput('location'),
      restaurantUpdatePage.setMarkInput('5'),
    ]);

    expect(await restaurantUpdatePage.getRestaurantIdInput()).to.eq('5', 'Expected restaurantId value to be equals to 5');
    expect(await restaurantUpdatePage.getTitleInput()).to.eq('title', 'Expected Title value to be equals to title');
    expect(await restaurantUpdatePage.getLocationInput()).to.eq('location', 'Expected Location value to be equals to location');
    expect(await restaurantUpdatePage.getMarkInput()).to.eq('5', 'Expected mark value to be equals to 5');

    await restaurantUpdatePage.save();
    expect(await restaurantUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await restaurantComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Restaurant', async () => {
    const nbButtonsBeforeDelete = await restaurantComponentsPage.countDeleteButtons();
    await restaurantComponentsPage.clickOnLastDeleteButton();

    restaurantDeleteDialog = new RestaurantDeleteDialog();
    expect(await restaurantDeleteDialog.getDialogTitle()).to.eq('coopCycleApp.restaurant.delete.question');
    await restaurantDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(restaurantComponentsPage.title), 5000);

    expect(await restaurantComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
