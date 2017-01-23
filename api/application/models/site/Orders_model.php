<?php

class Orders_model extends CI_Model{

    public function get( $userId )
    {

        $this->db->where( 'userId' , $userId );
        $q = $this->db->get( 'orders' );
        $q = $q->result();

        return $q;

    }

    public function create( $data )
    {
        $this->db->insert( 'orders' , $data );
    }



}