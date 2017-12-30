AtechnologiesPaginatorBundle
========================

## Requisitos Previos

Esta versión del paquete requiere Symfony 2.1+. y 3.+

## Instalación

La instalación es rápida y sencilla:

1. Descarga AtechnologiesPaginatorBundle via composer
2. Habilitar el paquete
3. Configuración

### Paso 1: Descargar usando composer

```js
{
    "require": {
        "atechnologies/paginator-bundle": "dev-master"
    }
}
```

Puede realizarlo directamente a travez del siguiente comando:

``` bash
$ composer require atechnologies/paginator-bundle
```

Composer instalará el paquete en el directorio `vendor / atechnologies` de su proyecto.

### Paso 2: Habilitar bundle

Habilitar bundle en el kernel:

``` php
<?php
// app/AppKernel.php

public function registerBundles()
{
    $bundles = array(
        // ...
        new Atechnologies\PaginatorBundle\AtechnologiesPaginatorBundle(),
    );
}
```

### Paso 3: Configuración de bundle

Configurar en caso de requerir otro retorno diferente al por defecto:

``` yaml
// app/config/config.yml

atechnologies_paginator:
    format_array: standard #default, standard ó dataTables
```