$names = @('Rex','Luna','Max','Mia','Thor','Nina','Oliver','Bella','Loki','Simba','Maya','Zeus','Lola','Zeca','Kira','Fred','Pipoca','Bento','Lia','Milo','Lua','Tobby','Mimi','Billy','Cacau','Amora','Bidu','Fiona','Marley','Kiko','Penny','Chico','Jade','Dino','Lala','Mel','Dudu','Lili','Teddy','Sasha','Pingo','Tina','Bola','Cookie','Nico','Ginger','Rubi','Koda','Mora','Bolt')
$dogs = @('SRD','Labrador','Golden Retriever','Poodle','Bulldog','Beagle','Shih Tzu','Pastor Alemão','Dachshund','Chihuahua')
$cats = @('SRD','Siamês','Persa','Maine Coon','Ragdoll','Angorá','Sphynx','Bengal','Siberiano','Exótico')
$silvestres = @('Coelho','Papagaio','Porquinho-da-índia','Tartaruga','Furão','Iguana','Hamster','Tucano','Curiango','Cágado')
$ages = @('6 meses','1 ano','2 anos','3 anos','4 anos','5 anos','7 anos','8 anos')
$sizes = @('Pequeno','Médio','Grande')
$sexes = @('Macho','Fêmea')
$environments = @('Apartamento','Casa com Quintal','Casa Pequena','Fazenda','Sítio','Área Rural')
$behaviors = @('Calmo','Ativo','Independente','Carinhoso','Brincalhão','Tranquilo','Alegre','Tímido','Protector','Sociável','Curioso','Quieto')
$compatibilities = @('Ideal para Apartamento','Casa com Quintal','Bom com Crianças','Sem Crianças','Pode ficar sozinho','Precisa de companhia','Aceita gatos','Não gosta de gatos','Bom com outros cães','Sociável com pessoas','Precisa de espaço','Adora receber visitas')
$health = @('Vacinado','Castrado','Vermifugado','Microchipado')
$contacts = @('Karen Lima','Bruno Alves','Mariana Souza','João Pedro','Ana Clara','Lucas Silva','Beatriz Rocha','Rafael Costa','Patrícia Oliveira','Gustavo Lima')
$animals = @()
for ($i = 1; $i -le 50; $i++) {
    if ($i -le 20) { $category = 'Cão' }
    elseif ($i -le 40) { $category = 'Gato' }
    else { $category = 'Silvestre' }

    $name = Get-Random -InputObject $names
    $species = switch ($category) {
        'Cão' { Get-Random -InputObject $dogs }
        'Gato' { Get-Random -InputObject $cats }
        default { Get-Random -InputObject $silvestres }
    }
    $breed = $species
    $age = Get-Random -InputObject $ages
    $size = Get-Random -InputObject $sizes
    $sex = Get-Random -InputObject $sexes
    $matchScore = Get-Random -Minimum 65 -Maximum 99
    $environment = Get-Random -InputObject $environments -Count 2
    $behaviorsSelected = Get-Random -InputObject $behaviors -Count 3
    $compatibilitiesSelected = Get-Random -InputObject $compatibilities -Count 2
    $healthSelected = Get-Random -InputObject $health -Count 3
    $badges = if ($i % 7 -eq 0) { @('SUPER MATCH') } else { @() }
    $description = "$name é um animal de personalidade $($behaviorsSelected[0].ToLower()) e se adapta bem a ambientes $($environment[0].ToLower())."
    $story = "Encontrado em " + (Get-Random -InputObject @('um parque','uma feira','um bairro residencial','uma área rural','um bosque','uma rua tranquila')) + ", foi resgatado com " + (Get-Random -InputObject @('muita fome','um pouco de medo','saúde estável','um ferimento leve','muita energia')) + "."
    $image = switch ($category) {
        'Cão' { "https://placedog.net/400/280?id=$i" }
        'Gato' { "https://placekitten.com/400/280?image=$i" }
        default { "https://placebear.com/400/280?image=$i" }
    }
    $contactName = Get-Random -InputObject $contacts
    $animal = [PSCustomObject]@{
        id = ('animal-{0:000}' -f $i)
        name = $name
        category = $category
        species = $species
        breed = $breed
        age = $age
        sex = $sex
        size = $size
        matchScore = $matchScore
        isFavorite = $false
        badges = $badges
        environment = $environment
        behaviors = $behaviorsSelected
        compatibilities = $compatibilitiesSelected
        health = $healthSelected
        description = $description
        story = $story
        images = @($image)
        contact = [PSCustomObject]@{
            caretakerName = $contactName
            phone = "(11) 9$(Get-Random -Minimum 1000 -Maximum 9999)-$(Get-Random -Minimum 1000 -Maximum 9999)"
            email = ((($name -replace ' ', '')).ToLower() + '@petmatch.org')
        }
    }
    $animals += $animal
}
$animals | ConvertTo-Json -Depth 10 | Set-Content -Path "..\data\animals.json" -Encoding utf8 -Force
"Wrote $($animals.Count) animals to data\animals.json" | Write-Output
