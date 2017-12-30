<?php

/*
 * This file is part of the Atechnologies package.
 * 
 * (c) www.atechnologies.com.ve
 * 
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Atechnologies\PaginatorBundle\Repository;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Atechnologies\PaginatorBundle\Repository\EntityRepository;

abstract class DoctrineRepository extends EntityRepository
{
    protected $entityManager;
    protected $logger;
    protected $container;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->entityManager = $manager;
    }

    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function setContainer(ContainerInterface $container = null) {
        $this->container = $container;
    }

    /**
     * Retorna un contructor de consultas con el alias de la clase
     * @return \Doctrine\ORM\QueryBuilder
     */
    function getQueryBuilder()
    {
        return $this->createQueryBuilder($this->getAlies());
    }
    
    /**
     * Retorna una consulta con los elementos activos
     * @return \Doctrine\ORM\QueryBuilder
     */
    function getQueryAllActives()
    {
        $qb = $this->getQueryBuilder();
        $qb
            ->andWhere($this->getAlies().".enabled = :enabled")
            ->setParameter("enabled", true)
        ;
        return $qb;
    }
    
    /**
     * Retorna los elementos activos
     * @return \Doctrine\ORM\QueryBuilder
     */
    function getAllActives()
    {
        $qb = $this->getQueryAllActives();        
        return $qb->getQuery()->getResult();
    }

    /**
     * Query paginator
     * @author Máximo Sojo maxsojo13@gmail.com <maxtoan at atechnologies>
     * @param  array
     * @param  array
     * @return [type]
     */
    public function createPaginator(array $criteria = array(),array $order = array()) 
    {
        $query = $this->getQueryBuilder();
        return $query->getQuery()->getArrayResult();
    }
}