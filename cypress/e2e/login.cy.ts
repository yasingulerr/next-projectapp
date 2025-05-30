describe('Login Sayfası', () => {
  it('Doğru bilgilerle giriş yapılabiliyor mu', () => {
    cy.visit('/login');

    // 🔹 Giriş için doğru kullanıcı bilgilerini yaz!
    cy.get('input[placeholder="Email"]').type('yasin123@gmail.com');
    cy.get('input[placeholder="Şifre"]').type('123456');

    cy.get('button[type="submit"]').click();

    // 🔹 Girişten sonra dashboard'a yönlendiriliyor mu?
    cy.url().should('include', '/dashboard');
  });
});
