import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌿 Iniciando seed do banco de dados...");

  // ==================== LIMPAR DADOS ANTIGOS ====================
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.house.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Dados antigos removidos");

  // ==================== CRIAR 6 CASAS ====================
  const houses = await prisma.house.createMany({
    data: [
      {
        name: "Casa do Lago",
        description:
          "Aconchegante casa com vista para o lago. Ideal para casais e pequenas famílias. Possui varanda com espreguiçadeiras.",
        location: "Lado norte da pousada",
        pricePerNight: 250.0,
        capacity: 2,
        amenities: JSON.stringify([
          "WiFi",
          "Ar condicionado",
          "TV Smart",
          "Piscina privada",
          "Varanda",
        ]),
        photos: JSON.stringify([
          "/houses/casa-do-lago-1.jpg",
          "/houses/casa-do-lago-2.jpg",
        ]),
        active: true,
      },
      {
        name: "Casa da Floresta",
        description:
          "Casa maior rodeada de árvores. Perfeita para famílias. Possui cozinha completa, sala e dois quartos.",
        location: "Lado sul da pousada",
        pricePerNight: 350.0,
        capacity: 4,
        amenities: JSON.stringify([
          "WiFi",
          "Ar condicionado",
          "Cozinha completa",
          "Churrasqueira",
          "Forno de pizza",
        ]),
        photos: JSON.stringify([
          "/houses/casa-da-floresta-1.jpg",
          "/houses/casa-da-floresta-2.jpg",
        ]),
        active: true,
      },
      {
        name: "Casa Aconchego",
        description:
          "Estúdio rústico e aconchegante. Ideal para casais que buscam intimidade. Decoração natural e ambiente tranquilo.",
        location: "Centro da pousada",
        pricePerNight: 200.0,
        capacity: 2,
        amenities: JSON.stringify([
          "WiFi",
          "Aquecedor",
          "Lareira",
          "Banheiro espaçoso",
          "Varanda com rede",
        ]),
        photos: JSON.stringify([
          "/houses/casa-aconchego-1.jpg",
          "/houses/casa-aconchego-2.jpg",
        ]),
        active: true,
      },
      {
        name: "Casa Família",
        description:
          "Ampla casa com múltiplos quartos. Excelente para famílias maiores ou grupos de amigos. Espaço comum grande.",
        location: "Lado leste da pousada",
        pricePerNight: 450.0,
        capacity: 6,
        amenities: JSON.stringify([
          "WiFi",
          "Ar condicionado",
          "Piscina",
          "Cozinha industrial",
          "Sala de jogos",
          "Churrasqueira",
        ]),
        photos: JSON.stringify([
          "/houses/casa-familia-1.jpg",
          "/houses/casa-familia-2.jpg",
        ]),
        active: true,
      },
      {
        name: "Casa Natureza",
        description:
          "Casa com estilo rustico construída em madeira. Conectada com a natureza. Ideal para quem busca desconectar.",
        location: "Lado oeste da pousada",
        pricePerNight: 280.0,
        capacity: 3,
        amenities: JSON.stringify([
          "WiFi",
          "Ar condicionado",
          "Hidromassagem",
          "Varanda com vista",
          "Piscina natural",
        ]),
        photos: JSON.stringify([
          "/houses/casa-natureza-1.jpg",
          "/houses/casa-natureza-2.jpg",
        ]),
        active: true,
      },
      {
        name: "Casa Sunset",
        description:
          "Casa luxuosa com piscina privada e vista para o pôr do sol. Tudo novo e moderno. Para quem quer luxo e conforto.",
        location: "Ponto mais alto da pousada",
        pricePerNight: 550.0,
        capacity: 4,
        amenities: JSON.stringify([
          "WiFi ultra rápido",
          "Ar condicionado 360º",
          "Piscina privada",
          "Home theater",
          "Sauna",
          "Jacuzzi",
          "Cozinha gourmet",
        ]),
        photos: JSON.stringify([
          "/houses/casa-sunset-1.jpg",
          "/houses/casa-sunset-2.jpg",
        ]),
        active: true,
      },
    ],
  });

  console.log(`✓ ${houses.count} casas criadas com sucesso!`);

  // ==================== CRIAR USUÁRIO ADMIN (PARA TESTES) ====================
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@sitiologoverde.com.br",
      name: "Administrador",
      phone: "11999999999",
    },
  });
  console.log("✓ Usuário admin criado");

  // ==================== CRIAR USUÁRIO TESTE ====================
  const testUser = await prisma.user.create({
    data: {
      email: "hospede@email.com",
      name: "João Silva",
      phone: "11988888888",
      cpf: "12345678901",
      address: "Rua das Flores, 123 - São Paulo, SP",
    },
  });
  console.log("✓ Usuário teste criado");

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📋 Resumo:");
  console.log(`   - ${houses.count} casas cadastradas`);
  console.log(`   - 1 usuário admin`);
  console.log(`   - 1 usuário de teste`);
  console.log("\n💾 Banco de dados: prisma/dev.db");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
