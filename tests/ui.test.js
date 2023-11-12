const {test, expect} = require("@playwright/test");

test("Verify 'All Books' link is visible", async ({page}) =>{
    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav.navbar');

    const allBooksLink = await page.$('a[href="/catalog"]');
    const isLinkVisible = await allBooksLink.isVisible();
    expect(isLinkVisible).toBe(true);
});

test("Verify 'Login' button is visible", async ({page}) =>{
    await page.goto('http://localhost:3000');
    await page.waitForSelector('nav.navbar');

    const loginButton = await page.$('a[href="/login"]');
    const isloginButtonVisible = await loginButton.isVisible();
    expect(isloginButtonVisible).toBe(true);
});

test('Verify That the "All Books" Link Is Visible', async ({page})=>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'peter@abv.bg');
    await page.fill('#password', '123456');
    await page.click('input.button');

    const allBooksLink = await page.$('a[href="/catalog"]')
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
    expect(isAllBooksLinkVisible).toBe(true);
});

test('Verify That the "My Books" Link Is Visible', async ({page}) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'peter@abv.bg');
    await page.fill('#password', '123456');
    await page.click('input[type="submit"]');

    const myBooksLink = await page.$('a[href="/profile"]');
    const isVisibleMyBooks = await myBooksLink.isVisible();
    expect(isVisibleMyBooks).toBe(true);
});

test('Verify That the "Add Book" Link Is Visible', async ({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'peter@abv.bg');
    await page.fill('#password', '123456');
    await page.click('input[type="submit"]');

    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
    expect(isAllBooksLinkVisible).toBe(true);
})

test("Verify That the User's Email Address Is Visible", async ({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'peter@abv.bg');
    await page.fill('#password', '123456');
    await page.click('input[type="submit"]');
    
    const userInfo = await page.$('#user > span');
    const isUserInfoVisible = await userInfo.isVisible();
    expect(isUserInfoVisible).toBe(true);
})

test("Submit the Form with Valid Credentials", async ({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'peter@abv.bg');
    await page.fill('#password', '123456');
    await page.click('input[type="submit"]');

    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe('http://localhost:3000/catalog');
}) 

test("Submit the Form with Empty Input Fields", async ({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.click('input[type="submit"]');

    page.on('dialog', async dialog =>{
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    })

    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3000/login');

})

test("Submit the Form with Empty Email Input Field" , async ({page}) =>{
    await page.goto('http://localhost:3000/login')
    await page.fill("#email", "")
    await page.fill("#password", "123456")
    await page.click('input[type="submit"]');

    page.on('dialog', async dialog =>{
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    })

    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3000/login');
});

test("Submit the Form with Empty Password Input Field", async ({page}) =>{
    await page.goto("http://localhost:3000/login");
    await page.fill("#email", "peter@abv.bg");
    await page.fill("#password", "");
    await page.click('input[type="submit"]');

    page.on("dialog", async dialog =>{
        expect(dialog.type()).toContain('alert')
        expext(dialog.message()).toContain('All fields are required!')
        await dialog.accept();
    })

    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3000/login');
})

test("Submit the Form with Different Passwords", async ({page}) =>{
    await page.goto("http://localhost:3000/login");
    await page.fill("#email", "peter@abv.bg");
    await page.fill("#password", "1234");
    await page.click('input[type="submit"]');

    page.on("dialog", async dialog =>{
        expect(dialog.type()).toContain('alert')
        expext(dialog.message()).toContain('All fields are required!')
        await dialog.accept();
    })

    await page.fill("#password", "4567");
    await page.click('input[type="submit"]');

    page.on("dialog", async dialog =>{
        expect(dialog.type()).toContain('alert')
        expext(dialog.message()).toContain('All fields are required!')
        await dialog.accept();
    })

    await page.$('a[href="/login"]');
    expect(page.url()).toBe('http://localhost:3000/login');
})

test("Add book whit correct data", async ({page}) =>{
    await page.goto("http://localhost:3000/login");
    await page.fill("#email", "peter@abv.bg");
    await page.fill("#password", "123456");
    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ]);

    await page.click('a[href="/create"]');
    await page.waitForSelector("#create-form")
    await page.fill('#title', 'Test Book');
    await page.fill('#description', 'This is a test book discription');
    await page.fill('#image', 'https://exampe.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
    await page.click('#create-form input[type="submit"]');

    await page.waitForURL('http://localhost:3000/catalog');
    expect(page.url()).toBe('http://localhost:3000/catalog');
})

test("Add book whit empty field", async ({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'peter@abv.bg');
    await page.fill('#password', '123456');
    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ])

    await page.click('a[href="/create"]');
    await page.waitForSelector("#create-form");
    await page.fill('#title', '');
    await page.fill('#description', 'This is a test book discription');
    await page.fill('#image', 'https://exampe.com/book-image.jpg');
    await page.selectOption('#type', 'Fiction');
    await page.click('#create-form input[type="submit"]');

    await page.on('dialog', async dialog =>{
        expect(dialog.type()).toContain('alert')
        expect(dialog.message()).toContain('All fields are required!')
        await dialog.accept();
    })

    await page.$('a[href="/create"]')
    expect(page.url()).toBe('http://localhost:3000/create');
})

test("Login and verify all books are displayed", async ({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'peter@abv.bg');
    await page.fill('#password', '123456');
    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ])

    await page.waitForSelector('#dashboard-page');
    const allBooks = await page.$$('.other-books-list li');
    expect(allBooks.length).toBeGreaterThan(0);
})

test("Login and navigation to Details page", async ({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'peter@abv.bg');
    await page.fill('#password', '123456');
    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ])

    await page.waitForSelector('.otherBooks')
    await page.click('.otherBooks a.button')
    await page.waitForSelector('.book-information');

    const bookDetail = await page.textContent('.book-information');
    expect(bookDetail.length).toBeGreaterThan(0);
})

test("Verify that guest user sees details button ", async ({page}) =>{
    await page.goto('http://localhost:3000/catalog')
    await page.waitForSelector('.other-books-list')

    const deataisButton = await page.$('#dashboard-page > ul > li:nth-child(1) > a')
    const isDeataisButtonVisible = await deataisButton.isVisible();

    expect(isDeataisButtonVisible).toBe(true);
})

test("Verify that All Info is displayed correctly ", async ({page}) =>{
    await page.goto('http://localhost:3000')
    await page.waitForSelector('#site-header a[href="/catalog"]')

    await page.click('#site-header a[href="/catalog"]')
    await page.waitForSelector('#dashboard-page')

    const visibleBooks = await page.$$('.other-books-list li');
    expect(visibleBooks.length).toBeGreaterThan(0);
})

test.only("Verify if Edit and Delete buttons are not visible for Non-Creator", async ({page}) =>{
    await page.goto('http://localhost:3000/login');
    await page.fill('#email', 'peter@abv.bg');
    await page.fill('#password', '123456');
    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForURL('http://localhost:3000/catalog')
    ])

    await page.waitForSelector('.navbar a[href="/profile"]')
    await page.click('.navbar a[href="/profile"]')
    await page.waitForURL('http://localhost:3000/profile')
    await page.waitForSelector('#my-books-page')
    const allMyBooksUrl = await page.$$eval('.my-books-list li a', e=>e.map((a)=>a.href))

    await page.waitForSelector('.navbar a[href="/catalog"]')
    await page.click('.navbar a[href="/catalog"]')
    await page.waitForURL('http://localhost:3000/catalog')
    const allBooksUrl = await page.$$eval(".other-books-list li a", e=>e.map((a)=>a.href));
   
    const notMyBookUrl = allBooksUrl.filter(x => !allMyBooksUrl.includes(x)).shift();

    await page.goto(notMyBookUrl);
    await page.waitForSelector('#details-page')

    const editAnddeleteLinks = await page.$$('.actions a') 
    expect(editAnddeleteLinks.length).toBeLessThanOrEqual(1);

})


